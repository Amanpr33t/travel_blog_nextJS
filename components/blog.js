
import {  useState, Fragment } from "react"
import Image from "next/image"
import { useRouter } from "next/router";
function Blog(props) {
    const { blogId, title, content, cloudinaryURL } = props
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    return (
        <Fragment>
            {loading  && <div className="w-full pt-28 flex justify-center">
                <p className="text-base font-medium">Loading...</p>
            </div>}
            {!loading && <Fragment><div className="w-full fixed top-14">
                <button className="rounded-lg bg-green-700 p-1 text-base font-medium text-white ml-1" onClick={() => {
                    router.replace('/')
                    setLoading(true)
                }}>Back to home</button>
            </div>
                <div className="w-3/4 bg-gray-200">
                    <div className="w-full flex justify-center">
                        <Image className="w-auto max-h-60" src={cloudinaryURL || '/images/travel.jpg'} alt='/images/travel.jpg' width={200} height={200} />
                    </div>
                    <div className="w-full flex justify-center pt-2 mb-2">
                        <p className="text-2xl font-bold">{title}</p>
                    </div>
                    <p className="bg-gray-300 pb-2 pl-1 pr-1 text-lg ">{content} </p>
                </div></Fragment >}
        </Fragment >
    )
}
export default Blog