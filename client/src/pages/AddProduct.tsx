import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { DataController } from "../services/data.services";
import useAuth from "../services/auth.services";
import { uploadToCloudinary } from "../services/cloudinary.services";
import type { ProductDetailIntrf } from "./ProductDetail";
import Loading from "../components/Loading";

export type MediaFile = {
    file: File;
    previewUrl: string;
    type: string;
    publicId?: string;
}

export function AddProduct() {
    const productFolder = 'products_shop';
    const queryClient = useQueryClient();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const { loading, user } = useAuth();
    const { insertData, message } = DataController();
    const currentUserId = user ? user.info.id : '';

    const [productName, setProductName] = useState<string>('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [productPrice, setProductPrice] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    function imageSelectorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files) return;

        const selectedFiles: MediaFile[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileType = file.type.split('/')[0];
            const previewUrl = URL.createObjectURL(file);

            if (fileType !== 'image') {
                URL.revokeObjectURL(previewUrl);
                continue;
            }

            selectedFiles.push({ file, previewUrl, type: fileType });
        }

        setMediaFiles(prev => [...prev, ...selectedFiles]);

        if (imageInputRef.current) imageInputRef.current.value = '';
    }

    function removeMediaFile(index: number) {
        const fileToRemove = mediaFiles[index];
        URL.revokeObjectURL(fileToRemove.previewUrl);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    const insertMutation = useMutation({
        onMutate: () => setIsUploading(true),
        mutationFn: async () => {
            const currentDate = new Date().toISOString();
            const productImages: { file_url: string; public_id: string; }[] = [];

            for (const media of mediaFiles) {
                const cloudinary = await uploadToCloudinary(media.file, productFolder);
                productImages.push({ file_url: cloudinary.url, public_id: cloudinary.publicId });
            }

            await insertData<ProductDetailIntrf>({
                api_url: 'http://localhost:1234/product/add-product',
                data: {
                    created_at: currentDate,
                    product_description: description.trim(),
                    product_images: productImages,
                    product_name: productName.trim(),
                    product_price: parseInt(productPrice),
                    product_stock: parseInt(stock),
                    user_id: currentUserId
                }
            });
        },
        onSuccess: () => {
            setIsUploading(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
            setDescription('');
            setProductName('');
            setProductPrice('');
            setStock('');
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${currentUserId}`] });
        },
        onError: () => {
            setIsUploading(false);
            setError(message);
        }
    });

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        insertMutation.mutate();
    }

    if (loading) return (
        <div className="flex justify-center items-center h-full bg-[#1a1a1a]">
            <Loading/>
        </div>
    );

    return (
        <section className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <form className="flex gap-[1.3rem] md:w-3/4 w-full p-4 flex-col bg-blue-900/20 backdrop-blur-lg rounded-lg border border-blue-400 overflow-y-auto" onSubmit={handleSubmit}>
                <input 
                    ref={imageInputRef}
                    type="file" 
                    className="hidden" 
                    onChange={imageSelectorHandler}
                    multiple 
                    accept="image/*,video/*"
                    id="media-upload"
                />
                <section 
                    className="border-dashed h-screen p-4 cursor-pointer border-2 border-purple-400 rounded-lg overflow-x-auto flex flex-col items-center justify-center"
                    onClick={() => imageInputRef.current?.click()}
                >
                    {mediaFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-purple-400">
                            <span className="text-lg">Click to select images or videos</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                            {mediaFiles.map((media, index) => (
                                <div key={index} className="relative group">
                                    <img 
                                        src={media.previewUrl} 
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            e.stopPropagation();
                                            removeMediaFile(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-4 w-6 h-6 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <textarea 
                    placeholder="Add description..." 
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="p-[0.8rem] h-screen text-white bg-blue-900/20 backdrop-blur-lg outline-0 border border-blue-400 rounded-lg text-[0.9rem] font-[550] resize-none"
                ></textarea>
                <div className="grid grid-cols-3 gap-4">
                    <input 
                        type="text" 
                        placeholder="product-name"
                        className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                        value={productName} 
                        onChange={(event) => setProductName(event.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="product-price" 
                        value={productPrice} 
                        className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                        onChange={(event) => setProductPrice(event.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="product-stock" 
                        value={stock} 
                        className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                        onChange={(event) => setStock(event.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="text-[0.9rem] p-[0.8rem] rounded-lg font-[550] cursor-pointer bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                    {isUploading ? 'Uploading...' : 'Tambah Produk'}
                </button>
            </form>
            <Navbar2/>
        </section>
    );
}