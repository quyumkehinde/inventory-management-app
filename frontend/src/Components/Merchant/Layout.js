import React from 'react';
import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
	ShoppingCartIcon,
	ChartBarIcon,
	HomeIcon,
	MenuAlt2Icon,
	XIcon,
} from '@heroicons/react/outline';
import { Link, Outlet } from 'react-router-dom';

const navigation = [
	{ name: 'Dashboard', href: 'dashboard', icon: HomeIcon, },
	{ name: 'Inventory', href: 'inventory', icon: ShoppingCartIcon, },
	{ name: 'Orders', href: 'orders', icon: ChartBarIcon, },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function Layout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>

						<div className="fixed inset-0 flex z-40">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute top-0 right-0 -mr-12 pt-2">
											<button
												type="button"
												className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className="flex-shrink-0 flex items-center px-4">
										<img
											className="h-8 w-auto"
											src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=300"
											alt="Workflow"
										/>
									</div>
									<div className="mt-5 flex-1 h-0 overflow-y-auto">
										<nav className="px-2 space-y-1">
											{navigation.map((item) => (
												<Link
													key={item.name}
													to={item.href}
													className={classNames(
														'/merchant/' + item.href === window.location.pathname ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600',
														'group flex items-center px-2 py-2 text-base font-medium rounded-md'
													)}
												>
													<item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
													{item.name}
												</Link>
											))}
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
							<div className="flex-shrink-0 w-14" aria-hidden="true">
								{/* Dummy element to force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
						<div className="flex items-center flex-shrink-0 px-4">
							<h2 className="text-gray-300 text-2xl font-medium">Dukka</h2>
						</div>
						<div className="mt-5 flex-1 flex flex-col">
							<nav className="flex-1 px-2 pb-4 space-y-1">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										className={classNames(
											'/merchant/' + item.href === window.location.pathname ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600',
											'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
										)}
									>
										<item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
										{item.name}
									</Link>
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className="md:pl-64 flex flex-col flex-1">
					<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
						<button
							type="button"
							className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<div className="flex-1 px-4 flex justify-end">
							<div className="ml-4 flex items-center md:ml-6">
								<button
									type="button"
									className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									<span className="sr-only">View notifications</span>
								</button>

								{/* Profile dropdown */}
								<Menu as="div" className="ml-3 relative">
									<div>
										<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											<span className="sr-only">Open user menu</span>
											<a
												className="text-red-800"
												href='/logout'
											>Logout</a>
										</Menu.Button>
									</div>
								</Menu>
							</div>
						</div>
					</div>

					<main>
						<div className="py-6">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
								<Outlet />
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
