import { Fragment, useState, useEffect } from "react"
import clientPromise from '../lib/mongodb'
import Card from "@/components/card";
import { useRouter } from "next/router";

export default function Home(props) {
  const { blogs } = props
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const loadingSetter = (boolean) => {
    setLoading(boolean)
  }
  const errorSetter = (boolean) => {
    setError(boolean)
  }

  useEffect(() => {
    if (props.status === 'error') {
      setError(true)
    }
  }, props.status)

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      setError(false)
    }
  }, [blogs])

  return (
    <Fragment>
      {!loading && blogs && blogs.length === 0 && <div className="w-full pt-28 flex flex-col place-items-center cursor-pointer">
        <p className="text-base font-medium">No blogs available.</p>
        <p className="text-base font-medium " >Add a blog.</p>
      </div>}
      {!loading && error && <div className="w-full pt-28 flex flex-col place-items-center cursor-pointer">
        <p className="text-base font-medium">{props.message}</p>
        <a className="text-base font-medium text-red-500" href="/" onClick={() => {
          setLoading(true)
        }}>Try again</a>
      </div>}
      {loading && <div className="w-full pt-28 flex justify-center">
        <p className="text-base font-medium">Loading...</p>
      </div>}
      {!loading && !error && <div className="fixed top-14">
        <button className="rounded-lg bg-green-500 p-1 text-base font-medium text-white ml-1" onClick={() => {
          router.replace('/add_blog')
          setLoading(true)
        }
        } >Add Blog</button>
      </div>}
      {!loading && !error && <div className="w-full pt-24 pb-10 flex flex-col place-items-center gap-14">
        {blogs && blogs.length > 0 && blogs.map(blog => {
          return <Card key={blog._id} id={blog._id} content={blog.content} title={blog.title} cloudinaryURL={blog.cloudinaryURL} loadingSetter={loadingSetter} errorSetter={errorSetter} />
        })}
      </div>}
    </Fragment>
  )
}

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db();

    const blogs = await db
      .collection("blogs")
      .find({})
      .toArray()
    return {
      props: { blogs: JSON.parse(JSON.stringify(blogs)) }
    }

  } catch (error) {
    return {
      props: {
        status: 'error',
        message: 'Some error occured'
      }
    }
  }
}
