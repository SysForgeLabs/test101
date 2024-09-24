'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, Heart, Bookmark, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

// Define the Content interface
interface Content {
  id: string
  title: string
  content: string
  date: string
  readTime: string
  image: string
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
  title: 'The Future of Artificial Intelligence in Web Development',
  content: `
    <p>Artificial Intelligence (AI) is rapidly transforming the landscape of web development, offering new possibilities and challenges for developers and businesses alike. As we move into an era of smarter, more intuitive web applications, it's crucial to understand the impact AI will have on our industry.</p>

    <h2>1. AI-Powered Design Systems</h2>
    <p>One of the most exciting developments is the emergence of AI-powered design systems. These tools can analyze user behavior, brand guidelines, and current design trends to generate unique, responsive layouts. This not only speeds up the design process but also ensures a more personalized user experience.</p>

    <h2>2. Intelligent Chatbots and Virtual Assistants</h2>
    <p>AI-driven chatbots and virtual assistants are becoming increasingly sophisticated. They can handle complex queries, learn from interactions, and provide a more human-like conversational experience. This technology is set to revolutionize customer service and user engagement on websites.</p>

    <h2>3. Predictive Analytics for User Behavior</h2>
    <p>AI algorithms can analyze vast amounts of user data to predict behavior and preferences. This allows developers to create more intuitive interfaces and personalized content, significantly enhancing user engagement and conversion rates.</p>

    <h2>4. Automated Code Generation and Optimization</h2>
    <p>AI tools are now capable of generating and optimizing code, potentially automating many routine tasks in web development. While this won't replace human developers, it will allow them to focus on more complex, creative aspects of development.</p>

    <h2>Conclusion</h2>
    <p>As AI continues to evolve, its integration into web development will only deepen. Developers who embrace these technologies and learn to work alongside AI will be well-positioned for the future of web development. The key will be to balance the efficiency and insights provided by AI with the creativity and ethical considerations that only humans can provide.</p>
  `,
  date: '2023-09-24',
  readTime: '5 min read',
  image: '/placeholder.svg?height=400&width=800',
  category: 'Technology',
  type: 'Article',
  views: 1200,
  likes: 45,
  bookmarks: 23,
  author: {
    name: 'Mihir Parmar',
    avatar: '/placeholder.svg?height=100&width=100',
    bio: 'AI enthusiast and web developer passionate about the future of technology.'
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
          <Image
            src={content.image}
            alt={content.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
          
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
              <span>{content.readTime}</span>
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
          <Skeleton className="w-full h-64" />
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