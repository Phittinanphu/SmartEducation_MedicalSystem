'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

/**
 * Profile dropdown component for the dashboard
 * 
 * Displays the user's profile picture and name, and provides a dropdown menu
 * with options to view profile and logout.
 * 
 * @param {Object} props Component props
 * @param {Object} props.user User object containing name, email, and image
 */
export default function ProfileDropdown({ user }) {
	const { logout } = useAuth()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)
	
	// Handle clicking outside the dropdown to close it
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	
	// Toggle dropdown visibility
	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}
	
	// Handle logout click
	const handleLogout = async () => {
		setIsOpen(false)
		await logout()
	}
	
	return (
		<div className="relative" ref={dropdownRef}>
			{/* Profile button */}
			<button
				className="flex items-center space-x-2 focus:outline-none"
				onClick={toggleDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium text-gray-700 hidden sm:block">
						{user?.name || 'User'}
					</span>
					
					<div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
						{user?.image ? (
							<Image
								src={user.image}
								alt={`${user.name}'s profile`}
								width={32}
								height={32}
								className="object-cover w-full h-full"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
								{user?.name?.charAt(0) || 'U'}
							</div>
						)}
					</div>
				</div>
			</button>
			
			{/* Dropdown menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
					<div className="px-4 py-2 border-b">
						<p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
						<p className="text-xs text-gray-500 truncate">{user?.email}</p>
					</div>
					
					<Link
						href="/profile"
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						onClick={() => setIsOpen(false)}
					>
						View Profile
					</Link>
					
					<button
						className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						onClick={handleLogout}
					>
						Log Out
					</button>
				</div>
			)}
		</div>
	)
} 