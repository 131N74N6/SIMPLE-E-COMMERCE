export type propsIntrf = {
    customer_firstname: string;
    customer_lastname: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    customer_country_code: string;
    handleFirstnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLastnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePostalCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCountryCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomerInfo(props: propsIntrf) {
    return (
        <form className='flex flex-col gap-4'>
            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_firstname" className='text-blue-300 font-medium text-[0.9rem]'>First Name</label>
                    <input 
                        type="text" 
                        placeholder='firstname'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_firstname" 
                        value={props.customer_firstname}
                        onChange={props.handleFirstnameChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_lastname" className='text-blue-300 font-medium text-[0.9rem]'>Last Name</label>
                    <input 
                        type="text" 
                        placeholder='lastname'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_lastname" 
                        value={props.customer_lastname}
                        onChange={props.handleLastnameChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_phone" className='text-blue-300 font-medium text-[0.9rem]'>Phone Number</label>
                    <input 
                        type="text" 
                        placeholder='phone number'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_phone" 
                        value={props.customer_phone}
                        onChange={props.handlePhoneChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_address" className='text-blue-300 font-medium text-[0.9rem]'>Address</label>
                    <input 
                        type="text" 
                        placeholder='address'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_address" 
                        value={props.customer_address}
                        onChange={props.handleAddressChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_city" className='text-blue-300 font-medium text-[0.9rem]'>City</label>
                    <input 
                        type="text" 
                        placeholder='city'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_city" 
                        value={props.customer_city}
                        onChange={props.handleCityChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_postal_code" className='text-blue-300 font-medium text-[0.9rem]'>Postal Code</label>
                    <input 
                        type="text" 
                        placeholder='postal_code'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_postal_code" 
                        value={props.customer_postal_code}
                        onChange={props.handlePostalCodeChange}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="customer_country_code" className='text-blue-300 font-medium text-[0.9rem]'>Country Code</label>
                    <input 
                        type="text" 
                        placeholder='country_code'
                        className='border border-blue-300 text-blue-300 text-[0.9rem] p-[0.45rem] outline-0 rounded font-medium'
                        name="customer_country_code" 
                        value={props.customer_country_code}
                        onChange={props.handleCountryCodeChange}
                    />
                </div>
            </div>
        </form>
    );
}