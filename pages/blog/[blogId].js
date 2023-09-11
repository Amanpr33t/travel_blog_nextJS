import { Fragment, useState, useEffect } from "react"
import Blog from "@/components/blog"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { useRouter } from "next/router"

export default function ShowBlog(props) {
  const router = useRouter()
  const [error, setError] = useState(false)
  useEffect(() => {
    if ( props.status === 'error') {
      setError(true)
    }
  }, props.status)

  return (
    <Fragment>
      {error && <div className="w-full pt-28 flex flex-col place-items-center cursor-pointer">
        <p className="text-base font-medium">{props.message}</p>
        <p className="text-base font-medium text-red-500" onClick={() => router.replace('/')} >Try again</p>
      </div>}
      {!error && <div className="w-full mt-28 flex flex-col place-items-center pb-6">
        <Blog blogId={props.blog[0]._id} title={props.blog[0].title} content={props.blog[0].content} cloudinaryURL={props.blog[0].cloudinaryURL} />
      </div>}
    </Fragment>
  )
}

export const getStaticProps = async (context) => {
  const { params } = context
  const blogId = params.blogId
  try {
    const client = await clientPromise;
    const db = client.db();

    const blog = await db
      .collection("blogs")
      .find({ _id: new ObjectId(blogId) })
      .toArray()
    return {
      props: { blog: JSON.parse(JSON.stringify(blog)) },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: {
        status: 'error',
        message: 'Some error occured'
      },
      revalidate: 60
    }
  }
}

export const getStaticPaths = async (context) => {
  try {
    const client = await clientPromise;
    const db = client.db()
    const blogs = await db
      .collection("blogs")
      .find({})
      .toArray()
    let pathWithParams = []
    if (blogs && blogs.length > 0) {
      blogs.forEach(blog => {
        pathWithParams.push({ params: { blogId: blog._id.toString() } })
      })
    }
    return {
      paths: pathWithParams,
      fallback: 'blocking'
    }
  } catch (error) {
    console.log(error)
  }
}

