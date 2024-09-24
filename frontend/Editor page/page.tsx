'use client'

import { useState } from 'react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Upload, X, Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['Article', 'Video']),
  coverImage: z.instanceof(File).optional().or(z.literal('')),
  publishDate: z.date(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  duration: z.string().optional(),
  transcript: z.string().optional(),
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    image: z.instanceof(File).optional().or(z.literal(''))
  })).optional(),
})

type ContentFormValues = z.infer<typeof contentSchema>

export default function AdvancedContentEditor() {
  const [selectedTab, setSelectedTab] = useState<'Article' | 'Video'>('Article')
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      type: 'Article',
      tags: [''],
      publishDate: new Date(),
      videoUrl: '',
      duration: '',
      transcript: '',
      sections: [{ title: '', content: '', image: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  })

  const onSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    try {
      console.log(data)
      toast({
        title: "Content submitted",
        description: "Your content has been successfully submitted.",
      })
      form.reset()
      setCoverImagePreview(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue('coverImage', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCoverImage = () => {
    form.setValue('coverImage', '')
    setCoverImagePreview(null)
  }

  const handleSectionImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue(`sections.${index}.image`, file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Content Editor</CardTitle>
          <CardDescription>Create rich articles or detailed video content for your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'Article' | 'Video')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Article">Article</TabsTrigger>
              <TabsTrigger value="Video">Video</TabsTrigger>
            </TabsList>
            <TabsContent value="Article">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the title of your article" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Programming">Programming</SelectItem>
                            <SelectItem value="Web Development">Web Development</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publish Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tags separated by commas"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.split(','))}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter tags separated by commas (e.g., web, development, react)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleCoverImageChange(e)
                                onChange(e.target.files?.[0] || null)
                              }}
                              {...field}
                            />
                            {coverImagePreview && (
                              <Button type="button" variant="outline" size="icon" onClick={removeCoverImage}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        {coverImagePreview && (
                          <img src={coverImagePreview} alt="Cover Preview" className="mt-2 max-w-full h-auto max-h-48 object-contain" />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <ReactQuill theme="snow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Article Sections</h3>
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-4 mb-6 p-4 border rounded">
                        <FormField
                          control={form.control}
                          name={`sections.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sections.${index}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section Content</FormLabel>
                              <FormControl>
                                <ReactQuill theme="snow" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sections.${index}.image`}
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Section Image</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    handleSectionImageChange(index, e)
                                    onChange(e.target.files?.[0] || null)
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Section
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ title: '', content: '', image: '' })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                  <input type="hidden" {...form.register('type')} value="Article" />
                  <Button type="submit">Submit Article</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="Video">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the title of your video" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Programming">Programming</SelectItem>
                            <SelectItem value="Web Development">Web Development</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publish Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) :
                                (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tags separated by commas"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.split(','))}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter tags separated by commas (e.g., tutorial, coding, react)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the URL of your video" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide the URL where your video is hosted (e.g., YouTube, Vimeo).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the duration of your video (e.g., 10:30)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleCoverImageChange(e)
                                onChange(e.target.files?.[0] || null)
                              }}
                              {...field}
                            />
                            {coverImagePreview && (
                              <Button type="button" variant="outline" size="icon" onClick={removeCoverImage}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        {coverImagePreview && (
                          <img src={coverImagePreview} alt="Thumbnail Preview" className="mt-2 max-w-full h-auto max-h-48 object-contain" />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <ReactQuill theme="snow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transcript"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transcript</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the transcript of your video" 
                            className="min-h-[200px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <input type="hidden" {...form.register('type')} value="Video" />
                  <Button type="submit">Submit Video</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}