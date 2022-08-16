import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { decodeToken } from 'react-jwt';
import config from '../../config';

export default function Inventory() {
	const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [items, setItems] = useState([]);
    const { register, handleSubmit, formState: { errors: formErrors }, reset } = useForm();

    const { userId } = decodeToken(config.TOKEN);
    const headers = { Authorization: `Bearer ${config.TOKEN }`};


    const generateDemoItems = () => {
        console.log(config.TOKEN);
        axios.post(`${config.BE_BASE_URL}/merchant/inventory/seed`, {}, { headers })
            .then(response => setItems(response.data.data.items))
            .catch(error => alert(error.response.data.message));
    };

    const addNewItem = (data) => {
        axios.post(`${config.BE_BASE_URL}/merchant/inventory`, data, { headers })
            .then(response => {
                setItems([response.data.data, ...items]);
                reset();
                alert(response.data.message);
            })
            .catch(error => alert(error.response.data.message)); 
    };

    const deleteItem = (id) => {
        axios.delete(`${config.BE_BASE_URL}/merchant/inventory/${id}`, { headers })
            .then(() => {
                setItems(items.filter(item => item.id !== id));
            })
            .catch(error => alert(error.response.data.message));
    };

    useEffect(() => {
        axios.get(`${config.BE_BASE_URL}/inventory?merchant_id=${userId}`)
            .then(response => {
                console.log(response.data.data);
                setItems(response.data.data);
            }, [])
            .catch(response => {
                console.log(response);
            });
    }, []);

	return(
		<section>
			<h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
				{showAddItemForm &&
                    <div className='mt-5'>
                        <h2 className='text-gray-600 font-medium text-lg'>Add New Item</h2>
                        <form onSubmit={handleSubmit(addNewItem)}>
                            <div className="mt-3">
                                <label className="text-gray-500 text-sm block">Item Name *</label>
                                <div className="mt-2">
                                    <input {...register('name', { required: true })} type="text" className="px-2 py-1 w-1/2 border border-gray-300 rounded" required="required" />
                                </div>
                                <span className="my-5 text-red-500 text-sm">{ formErrors.name && 'This field is required.' }</span>
                            </div>
                            <div className="mt-3">
                                <label className="text-gray-500 text-sm block">Description *</label>
                                <div className="mt-2">
                                    <textarea {...register('description', { required: true })} type="text" className="px-2 py-1 w-1/2 border border-gray-300 resize-none rounded" required="required" ></textarea>
                                </div>
                                <span className="my-5 text-red-500 text-sm">{ formErrors.name && 'This field is required.' }</span>
                            </div>
                            <div className="mt-3">
                                <label className="text-gray-500 text-sm block">Price *</label>
                                <div className="mt-2">
                                    <input {...register('price', { required: true })} type="number" className="px-2 py-1 w-1/2 border border-gray-300 rounded" required="required" />
                                </div>
                                <span className="my-5 text-red-500 text-sm">{ formErrors.name && 'This field is required.' }</span>
                            </div>
                            <div className="mt-3">
                                <label className="text-gray-500 text-sm block">Quantity *</label>
                                <div className="mt-2">
                                    <input {...register('quantity', { required: true })} type="number" className="px-2 py-1 w-1/2 border border-gray-300 rounded" required="required" />
                                </div>
                                <span className="my-5 text-red-500 text-sm">{ formErrors.name && 'This field is required.' }</span>
                            </div>
                            <div className="mt-3">
                                <label className="text-gray-500 text-sm block">Image URL *</label>
                                <div className="mt-2">
                                    <input {...register('image_url', { required: true })} type="url" className="px-2 py-1 w-1/2 border border-gray-300 rounded" required="required" />
                                </div>
                                <span className="my-5 text-red-500 text-sm">{ formErrors.name && 'This field is required.' }</span>
                            </div>
                            <div className="mt-6">
                                <button type='submit' className="p-2 bg-indigo-600 text-white text-sm rounded">Add Item</button>
                            </div>
                        </form>
                    </div>
				}
				<div className='mt-16 sm:flex sm:items-center'>
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">Items</h1>
						<p className="mt-2 text-sm text-gray-700">
                            Here is a list of all items in your inventory
						</p>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<button
							type="button"
                            onClick={() => setShowAddItemForm(!showAddItemForm)}
							className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
						>
                            {showAddItemForm ? 'Hide Form' : 'Add Item'}
						</button>
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                {items.length === 0 
                                    ? <p className='text-gray-700 text-md'>
                                        Add items to your inventory to see them here. Click 
                                        <span className='text-indigo-600 cursor-pointer' onClick={() => generateDemoItems()}> here </span>
                                        to add some demo items.
                                    </p> 
                                    : <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    ID
                                                </th>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Quantity
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only text-red-500">Delete</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {items.map((item, itemIdx) => (
                                                <tr key={itemIdx} className={itemIdx % 2 === 0 ? undefined : 'bg-gray-50'}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 pl-5">{item.id}</td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {item.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.description && item.description.substring(0, 40)}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.price}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.quantity}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                            Edit<span className="sr-only">, {item.name}</span>
                                                        </a>
                                                        <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-indigo-900 inline-block pl-5">
                                                            Delete<span className="sr-only">, {item.name}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
						</div>
					</div>
				</div>
		</section>
	);
}