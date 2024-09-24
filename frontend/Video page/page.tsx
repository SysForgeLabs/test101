'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, Heart, Bookmark, Share2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

// Define the Content interface
interface Content {
  id: string
  title: string
  content: string
  date: string
  duration: string
  image: string
  videoUrl?: string
  category: string
  type: 'Article' | 'Video' | 'Project' | 'Repository'
  views: number
  likes: number
  bookmarks: number
  author: {
    name: string
    avatar: string
    bio: string
  }
}

// Dummy data for preview
const dummyContent: Content = {
  id: '1',
  title: 'Introduction to React Hooks',
  content: `
    <p>React Hooks have revolutionized the way we write React components. In this video, we'll explore the basics of useState and useEffect, two of the most commonly used hooks.</p>
    
    <h2>What You'll Learn</h2>
    <ul>
      <li>Understanding the concept of Hooks</li>
      <li>Using useState for state management</li>
      <li>Implementing side effects with useEffect</li>
      <li>Best practices and common pitfalls</li>
    </ul>

    <p>After watching this video, you'll have a solid foundation for using React Hooks in your projects. Don't forget to like and subscribe for more React tutorials!</p>
  `,
  date: '2023-09-25',
  duration: '15:30',
  image: '/placeholder.svg?height=400&width=800',
  videoUrl: 'https://www.example.com/sample-video.mp4',
  category: 'Web Development',
  type: 'Video',
  views: 5000,
  likes: 320,
  bookmarks: 150,
  author: {
    name: 'Mihir Parmar',
    avatar: '/placeholder.svg?height=100&width=100',
    bio: 'Frontend developer and educator passionate about React and modern web technologies.'
  }
}

export default function ContentPage() {
  const params = useParams()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      setContent(dummyContent)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (loading) {
    return <ContentSkeleton />
  }

  if (!content) {
    return <div>Content not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {content.type === 'Video' ? (
            <div className="relative aspect-video">
              <Image
                src={content.image}
                alt={content.title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/80 hover:bg-white"
                  onClick={() => alert('Play video')} // Replace with actual video play logic
                >
                  <Play className="h-6 w-6 text-blue-600" />
                  <span className="sr-only">Play video</span>
                </Button>
              </div>
            </div>
          ) : (
            <Image
              src={content.image}
              alt={content.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {content.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {content.type}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {content.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={content.author.avatar} alt={content.author.name} />
                <AvatarFallback>{content.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {content.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {content.author.bio}
                </p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={content.date}>{new Date(content.date).toLocaleDateString()}</time>
              <Clock className="ml-4 mr-2 h-4 w-4" />
              <span>{content.type === 'Video' ? content.duration : 'Read time'}</span>
              <Eye className="ml-4 mr-2 h-4 w-4" />
              <span>{content.views} views</span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: content.content }} />
            
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  Like ({content.likes})
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmark ({content.bookmarks})
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center mb-4">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center mb-6">
              <Skeleton className="h-4 w-24 mr-4" />
              <Skeleton className="h-4 w-24 mr-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="flex items-center justify-between pt-6">
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}