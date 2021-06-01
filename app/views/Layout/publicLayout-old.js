import React, { useState, Fragment, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import useRouter from "next/router"
import { GET_PROFILE } from "./modules/queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ClockIcon, HomeIcon, MenuAlt1Icon, ArrowLeftIcon, MailIcon, CodeIcon, UserIcon, SupportIcon, CashIcon, XIcon } from '@heroicons/react/outline'
import {
  SelectorIcon,
} from '@heroicons/react/solid'
import { Button } from "app/components/forms";


const Page = (props) => {
  const [showBusiness, setShowBusiness] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [user, setUser] = useState();
  const { data } = useQuery(GET_PROFILE, {
    //  fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const { me } = data;
      const user = {
        name: me.name,
        photo: me.photo,
      }
      setUser(user);
      const isBusiness = me && me.account_type?.code === 'business';
      setShowBusiness(isBusiness)
    }
  })
  const { children, pageTitle = "", isDynamic = false, back, pathname, query, frameMaxWidth, framePadding, hideHeader, homePageURL = "/" } = props;
  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, },
    { name: 'Payments', href: '/account', icon: CashIcon, },
    { name: 'Recent', href: '#', icon: ClockIcon, },
    { name: 'Developer', href: '/developers', icon: CodeIcon, },
    { name: 'Support', href: '/support', icon: MailIcon, },
    { name: 'Settings', href: '/settings', icon: SupportIcon, },
  ]
  const shipping = [
    { name: 'Deliveries', href: '/deliveries', bgColorClass: 'bg-indigo-500' },
    { name: 'Pickups', href: '/pickups', bgColorClass: 'bg-green-500' },
    { name: 'Imports', href: '/deliveries/imports', bgColorClass: 'bg-yellow-500' },
    { name: 'Check Rates', href: '/quote', bgColorClass: 'bg-red-500' },
  ]

  const business = [
    { name: 'Dashboard', href: '/business', bgColorClass: 'bg-indigo-500' },
    { name: 'Products', href: '/business/products', bgColorClass: 'bg-green-500' },
    { name: 'Orders', href: '/business/orders', bgColorClass: 'bg-yellow-500' },
    { name: 'Customers', href: '/business/customers', bgColorClass: 'bg-red-500' },
  ]


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }



  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
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
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/images/sendbox-logo.svg"
                  alt="Sendbox Logo"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                      >
                        <a

                          className={classNames(
                            item.href === pathname
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                            'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                          )}
                          aria-current={item.href === pathname ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              item.href === pathname ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-3 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>

                    ))}
                  </div>
                  <div className="mt-8">
                    <h3
                      className="px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      id="shipping-headline"
                    >
                      Shipping
                          </h3>
                    <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                      {shipping.map((list) => (
                        <Link
                          key={list.name}
                          href={list.href}
                        >
                          <a
                            className={classNames(
                              list.href === pathname
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                              'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                            )}
                          >
                            <span
                              className={classNames(list.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                              aria-hidden="true"
                            />
                            <span className="truncate">{list.name}</span>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3
                      className="px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      id="business-headline"
                    >
                      Business
                          </h3>
                    <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                      {business.map((list) => (
                        <Link
                          key={list.name}
                          href={list.href}
                        >
                          <a

                            className={classNames(
                              list.href === pathname
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                              'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                            )}                                    >
                            <span
                              className={classNames(list.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                              aria-hidden="true"
                            />
                            <span className="truncate">{list.name}</span>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 pt-5 pb-4 border-r border-gray-200 bg-gray-100">
          <div className="flex items-center flex-shrink-0 px-6">
            <img
              className="h-8 w-auto"
              src="/images/sendbox-logo.svg"
              alt="Sendbox Logo"
            />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            <Menu as="div" className="px-3 mt-6 relative inline-block text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                      <span className="flex w-full justify-between items-center">
                        <span className="flex min-w-0 items-center justify-between space-x-3">
                          {/* <img
                                  className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                                  alt=""
                                /> */}
                          {user?.photo ? <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={photo} alt="profile-photo" /> :
                            <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-900 group-hover:text-gray-500" aria-hidden="true" />
                          }
                          <span className="flex-1 flex flex-col min-w-0">
                            <span className="text-gray-900 text-sm font-medium truncate">{user?.name}</span>
                            {/* <span className="text-gray-900  text-sm truncate">@jessyschwarz</span> */}
                          </span>
                        </span>
                        <SelectorIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="#">
                              <a
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                View profile
                                        </a>
                            </Link>

                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="#">
                              <a
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Settings
                                        </a>
                            </Link>

                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="#">
                              <a
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Notifications
                                        </a>
                            </Link>

                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">

                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/support">
                              <a

                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Support
                                        </a>
                            </Link>

                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="#">
                              <a

                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Logout
                                    </a>
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            <div className="px-3 mt-5">
              <div className="flex flex-col">
                <button type="button" className="inline-flex font-semibold items-center justify-center bg-black px-4 py-2 border border-transparent shadow-sm text-sm rounded-md text-white bg-primary hover:bg-transluscent-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-full">
                  Book Delivery
                            </button>

              </div>
            </div>
            {/* Navigation */}
            <nav className="px-3 mt-6">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                  >
                    <a

                      className={classNames(
                        item.href === pathname ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                      aria-current={item.href === pathname ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.href === pathname ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>

                ))}
              </div>
              <div className="mt-8">
                {/* Secondary navigation */}
                <h3 className="px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider" id="teams-headline">
                  Shipping
                      </h3>
                <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                  {shipping.map((list) => (
                    <Link
                      key={list.name}
                      href={list.href}
                    >
                      <a
                        className={classNames(
                          list.href === pathname
                            ? 'bg-gray-200 text-gray-900'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                          'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                        )}
                      >
                        <span
                          className={classNames(list.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                          aria-hidden="true"
                        />
                        <span className="truncate">{list.name}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="my-8">
                {/* Secondary navigation */}
                <h3 className="px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider" id="teams-headline">
                  Business
                      </h3>
                <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                  {business.map((list) => (
                    <Link
                      key={list.name}
                      href={list.href}
                    >
                      <a
                        className={classNames(
                          list.href === pathname
                            ? 'bg-gray-200 text-gray-900'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                          'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                        )}
                      >
                        <span
                          className={classNames(list.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
                          aria-hidden="true"
                        />
                        <span className="truncate">{list.name}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Main column */}
      <div className="flex flex-col w-0 flex-1">
        {/* header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-black border-b border-textGrey lg:hidden">
          <button
            className="px-4 border-r border-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex">

            </div>
            <div className="flex items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <span className="sr-only">Open user menu</span>
                        {user?.photo ? <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={photo} alt="profile-photo" /> :
                          <UserIcon className="flex-shrink-0 h-8 w-8 text-textGrey group-hover:text-gray-500" aria-hidden="true" />
                        }
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                      >
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                View profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Notifications
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1">

                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Support
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                Logout
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-hidden focus:outline-none" tabIndex="0">
          {isDynamic ? (
            <div className={"hidden text-black h-16 p-2 text-xs z-40 bg-white w-full lg:flex justify-between  items-center font-semibold inset-0 sticky shadow"}>
              <div className={"h-full items-center flex justify-center"}>
                <Button
                  className={"w-5 bg-transparent focus:outline-none outline-none border-0"}
                  onClick={() => back()}
                >
                  <ArrowLeftIcon className="w-full text-black" />
                </Button>
              </div>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  )

}

export default Page;







