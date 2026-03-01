import { useNavigate, useParams } from "react-router-dom"
import { DataController } from "../services/data.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductDetailIntrf } from "./ProductDetail";
import { useEffect, useRef, useState } from "react";
import useAuth from "../services/auth.services";
import type { MediaFile } from "./AddProduct";
import { uploadToCloudinary } from "../services/cloudinary.services";
import { X } from "lucide-react";
import { Notification2 } from "../components/Notification";
import Loading from "../components/Loading";

export default function EditProduct() {
    const productFolder = 'products_shop';
    const { _id } = useParams();
    const { user } = useAuth();
    const { deleteChosenData, getData, message, updateData, setMessage } = DataController();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: selectedProduct, isLoading, error } = getData<ProductDetailIntrf[]>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/product/detail/${_id}`,
        query_key: [`edit-product-details-${_id}`],
        stale_time: 600000
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const currentUserId = user ? user.info.id : '';
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [existingImages, setExistingImages] = useState<{ file_url: string; public_id: string }[]>([]);
    const [editProduct, setEditProduct] = useState({ product_description: '', product_name: '', product_price: '', product_stock: '' });
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);
    const [deleteImage, setDeleteImage] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEditProduct({ ...editProduct, [name]: value });
    }

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

    function removeNewMediaFile(index: number) {
        const fileToRemove = mediaFiles[index];
        URL.revokeObjectURL(fileToRemove.previewUrl);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }

    function removeExistingImage(publicId: string) {
        setExistingImages(prev => prev.filter(img => img.public_id !== publicId));
        setDeleteImage(prev => [...prev, publicId]);
    }

    const updateMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            const productImages: { file_url: string; public_id: string; }[] = [];

            for (const media of mediaFiles) {
                const cloudinary = await uploadToCloudinary(media.file, productFolder);
                productImages.push({ file_url: cloudinary.url, public_id: cloudinary.publicId });
            }

            if (deleteImage.length > 0) {
                await deleteChosenData(`${import.meta.env.VITE_API_BASE_URL}/product/delete-chosen`, deleteImage);
            }

            await updateData<ProductDetailIntrf>({
                api_url: `${import.meta.env.VITE_API_BASE_URL}/product/update/${_id}`,
                data: {
                    product_description: editProduct.product_description.trim(),
                    product_images: [...existingImages, ...productImages],
                    product_name: editProduct.product_name.trim(),
                    product_price: parseInt(editProduct.product_price.trim()),
                    product_stock: parseInt(editProduct.product_stock.trim())
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`cart-items-${currentUserId}`]});
            queryClient.invalidateQueries({ queryKey: [`edit-product-details-${_id}`] });
            navigate(`/your-shop/${currentUserId}`);
        },
        onSettled: () => {
            if (imageInputRef.current) imageInputRef.current.value = '';
            setIsDataChanging(false);
            setEditProduct({ product_description: '', product_name: '', product_price: '', product_stock: '' });
            setExistingImages([]);
            setMediaFiles([]);
        }
    });

    useEffect(() => {
        if (selectedProduct && selectedProduct.length > 0) {
            setExistingImages([...selectedProduct[0].product_images]);
            setEditProduct({ 
                product_description: selectedProduct[0].product_description,
                product_name: selectedProduct[0].product_name,
                product_price: selectedProduct[0].product_price.toString(),
                product_stock: selectedProduct[0].product_stock.toString()
            });
        }
    }, [selectedProduct, _id, navigate]);

    function handleUpdateSubmit(event: React.FormEvent) {
        event.preventDefault();
        updateMutation.mutate();
    }

    return (
        <section className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            {message ? <Notification2 message_text={message}/> : null}
            {isLoading ? (
                <div className="flex justify-center items-center h-full w-full bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 ">
                    <Loading/>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-full w-full bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 ">
                    <p className="font-medium text-blue-300 text-[0.9rem] text-center">{error.message}</p>
                </div> 
            ) : (
                <form className="flex gap-[1.3rem] w-full p-4 flex-col bg-blue-900/20 backdrop-blur-lg rounded-lg border border-blue-400 h-full" onSubmit={handleUpdateSubmit}>
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
                        className="border-dashed h-screen p-4 cursor-pointer border-2 border-blue-400 rounded-lg"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        {mediaFiles.length === 0 && existingImages.length === 0 ? (
                            <div className="flex flex-col items-center h-full justify-center text-blue-400">
                                <span className="text-lg">Click to select images</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-h-75 overflow-y-auto">
                                {existingImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={image.file_url} 
                                            alt={`Existing ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                e.stopPropagation();
                                                removeExistingImage(image.public_id);
                                            }}
                                            className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} color="white"/>
                                        </button>
                                    </div>
                                ))}
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
                                                removeNewMediaFile(index);
                                            }}
                                            className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} color="white"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                    <textarea 
                        placeholder="Add description..." 
                        name="product_description"
                        value={editProduct.product_description}
                        onChange={handleInputChange}
                        className="p-[0.8rem] h-screen text-white bg-blue-900/20 backdrop-blur-lg outline-0 border border-blue-400 rounded-lg text-[0.9rem] font-[550] resize-none"
                    ></textarea>
                    <div className="grid grid-cols-3 gap-4">
                        <input 
                            type="text" 
                            name="product_name"
                            placeholder="product name"
                            className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                            value={editProduct.product_name} 
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name="product_price"
                            placeholder="product price" 
                            value={editProduct.product_price} 
                            className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                            onChange={handleInputChange}
                        />
                        <input 
                            type="text" 
                            name="product_stock"
                            placeholder="product stock" 
                            value={editProduct.product_stock} 
                            className="border-blue-300 text-blue-300 p-[0.4rem] text-[0.9rem] outline-0 border"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <button
                            type="button"
                            disabled={isDataChanging}
                            onClick={() => navigate(`/your-shop/${currentUserId}`)} 
                            className="text-[0.9rem] p-[0.8rem] rounded-lg font-[550] cursor-pointer bg-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                        >
                            {isDataChanging ? 'Updating...' : 'Kembali'}
                        </button>
                        <button 
                            type="submit" 
                            disabled={isDataChanging}
                            className="text-[0.9rem] p-[0.8rem] rounded-lg font-[550] cursor-pointer bg-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                        >
                            {isDataChanging ? 'Updating...' : 'Edit Produk'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}