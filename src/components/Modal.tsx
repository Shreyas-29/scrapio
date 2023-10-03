"use client";

import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import Image from "next/image";
import { Loader2, Mail, X } from "lucide-react";
import { addUserEmailToProduct } from "@/actions";
import toast from "react-hot-toast";

interface ModalProps {
    productId: string;
}

const Modal: FC<ModalProps> = ({ productId }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            addUserEmailToProduct(productId, email);

        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setEmail("");
                closeModal();
                toast.success("You will be notified when the price drops!");
            }, 1500);
        }

    }

    return (
        <>
            <button
                type="button"
                className="btn"
                onClick={openModal}
            >
                Track
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" onClose={closeModal} className="dialog-container">
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        />

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="dialog-content">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 border border-gray-200 rounded-10">
                                            <Image
                                                src="/assets/icons/logo.svg"
                                                width={30}
                                                height={30}
                                                alt="logo"
                                            />
                                        </div>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                                            <X className="w-5 h-5 cursor-pointer text-gray-700" onClick={closeModal} />
                                        </div>
                                    </div>
                                    <h4 className="text-lg mt-4 font-semibold text-gray-900 font-base">
                                        Stay updated with product pricing alerts right in your inbox!
                                    </h4>
                                    <p className="text-sm mt-3 text-gray-500">
                                        Never miss a price drop again!
                                    </p>
                                </div>
                                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                                    <label htmlFor="email" className="font-medium text-gray-700 text-sm">
                                        Email Address
                                    </label>
                                    <div className="dialog-input_container relative">
                                        <Mail className="w-5 h-5 text-gray-500 absolute top-3.5 left-4" />
                                        <input
                                            required
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="dialog-input border-none outline-none ml-6"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="dialog-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin mr-2" /> : null}
                                        {isLoading ? "Submitting..." : "Track"}
                                    </button>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default Modal;