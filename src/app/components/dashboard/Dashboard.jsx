'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import ProfileDropdown from './ProfileDropdown'
import styles from './dashboard.module.css'

// Icons (using inline SVGs for simplicity)
const CaseIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
	</svg>
)

const StatsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
	</svg>
)

const CalendarIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
	</svg>
)

const ChatIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
	</svg>
)

/**
 * Dashboard Component
 * 
 * Main dashboard page for the medical training simulation application.
 * Provides access to key features and displays user statistics.
 */
export default function Dashboard() {
	const { user, loading } = useAuth()
	const [stats, setStats] = useState({
		completedCases: 0,
		averageScore: 0,
		upcomingSimulations: 0
	})
	
	// Fetch user stats when component mounts
	useEffect(() => {
		// This would typically be an API call to fetch user statistics
		// For now, we'll simulate this with mock data
		const fetchStats = async () => {
			// Mock API call delay
			await new Promise(resolve => setTimeout(resolve, 500))
			
			setStats({
				completedCases: 12,
				averageScore: 85,
				upcomingSimulations: 3
			})
		}
		
		if (user) {
			fetchStats()
		}
	}, [user])
	
	// Handle loading state
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
					<p className="mt-2 text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		)
	}
	
	return (
		<div className={styles.container}>
			{/* Header with user profile */}
			<header className={`${styles.header} px-4 py-3 flex items-center justify-between`}>
				<div className={styles.logo}>MedSimTrainer</div>
				
				<div className="flex items-center space-x-4">
					<ProfileDropdown user={user} />
				</div>
			</header>
			
			{/* Welcome section */}
			<section className={`${styles.welcomeSection} px-4 py-8 mb-6`}>
				<div className="container mx-auto">
					<h1 className={styles.welcomeText}>Welcome back, {user?.name || 'Student'}!</h1>
					<p className={`${styles.welcomeDescription} mt-2`}>
						Continue your medical training journey with our interactive simulations
					</p>
				</div>
			</section>
			
			{/* Main content */}
			<main className="container mx-auto px-4 py-6">
				{/* Stats section */}
				<section className="mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className={styles.statCard}>
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Completed Cases</p>
									<p className="text-2xl font-bold text-blue-600">{stats.completedCases}</p>
								</div>
								<div className="bg-blue-100 p-2 rounded-full">
									<CaseIcon />
								</div>
							</div>
						</div>
						
						<div className={styles.statCard}>
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Average Score</p>
									<p className="text-2xl font-bold text-green-600">{stats.averageScore}%</p>
								</div>
								<div className="bg-green-100 p-2 rounded-full">
									<StatsIcon />
								</div>
							</div>
						</div>
						
						<div className={styles.statCard}>
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm text-gray-500">Upcoming Simulations</p>
									<p className="text-2xl font-bold text-purple-600">{stats.upcomingSimulations}</p>
								</div>
								<div className="bg-purple-100 p-2 rounded-full">
									<CalendarIcon />
								</div>
							</div>
						</div>
					</div>
				</section>
				
				{/* Training modules section */}
				<section className="mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Training Modules</h2>
					<div className={styles.cardGrid}>
						{/* Case studies card */}
						<Link href="/studycase" className={`${styles.card} p-6 block`}>
							<div className="flex items-start">
								<div className="bg-blue-100 p-2 rounded-full mr-4">
									<CaseIcon />
								</div>
								<div>
									<h3 className="font-medium text-gray-900 mb-1">Case Studies</h3>
									<p className="text-sm text-gray-500">
										Practice with realistic patient scenarios to improve your diagnostic skills
									</p>
								</div>
							</div>
						</Link>
						
						{/* Virtual consultations card */}
						<Link href="/chat_page" className={`${styles.card} p-6 block`}>
							<div className="flex items-start">
								<div className="bg-green-100 p-2 rounded-full mr-4">
									<ChatIcon />
								</div>
								<div>
									<h3 className="font-medium text-gray-900 mb-1">Virtual Consultations</h3>
									<p className="text-sm text-gray-500">
										Practice communication skills with simulated patient interactions
									</p>
								</div>
							</div>
						</Link>
						
						{/* Performance analytics card */}
						<Link href="/history" className={`${styles.card} p-6 block`}>
							<div className="flex items-start">
								<div className="bg-purple-100 p-2 rounded-full mr-4">
									<StatsIcon />
								</div>
								<div>
									<h3 className="font-medium text-gray-900 mb-1">Performance Analytics</h3>
									<p className="text-sm text-gray-500">
										Track your progress and identify areas for improvement
									</p>
								</div>
							</div>
						</Link>
					</div>
				</section>
				
				{/* Recent activity section */}
				<section className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
						<Link href="/history" className="text-blue-600 text-sm hover:underline">
							View all
						</Link>
					</div>
					
					{/* Activity list */}
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<div className="p-4 border-b border-gray-100">
							<div className="flex justify-between">
								<div>
									<p className="font-medium text-gray-800">Completed Case Study: Chest Pain</p>
									<p className="text-sm text-gray-500 mt-1">Score: 92%</p>
								</div>
								<span className="text-xs text-gray-400">2 days ago</span>
							</div>
						</div>
						
						<div className="p-4 border-b border-gray-100">
							<div className="flex justify-between">
								<div>
									<p className="font-medium text-gray-800">Virtual Consultation: Diabetes Management</p>
									<p className="text-sm text-gray-500 mt-1">Score: 85%</p>
								</div>
								<span className="text-xs text-gray-400">5 days ago</span>
							</div>
						</div>
						
						<div className="p-4">
							<div className="flex justify-between">
								<div>
									<p className="font-medium text-gray-800">Completed Case Study: Pediatric Fever</p>
									<p className="text-sm text-gray-500 mt-1">Score: 78%</p>
								</div>
								<span className="text-xs text-gray-400">1 week ago</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
} 