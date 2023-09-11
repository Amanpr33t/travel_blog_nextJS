
import {  Fragment } from "react"
import Image from "next/image"
import { FaTrash } from "react-icons/fa"
import { AiFillEdit } from "react-icons/ai";
import { useRouter } from "next/router"

function Card(props) {
    const { id, title, content, cloudinaryURL, loadingSetter, errorSetter } = props
    const router = useRouter()
    const deleteBlog = async () => {
        loadingSetter(true)
        try {
            const response = await fetch(`/api/blog/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                router.replace('/')
                loadingSetter(false)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            loadingSetter(false)
            errorSetter(true)
        }
    }


    return (
        <Fragment>
            <div className="w-3/4 bg-gray-100">
                <div className="w-full flex justify-center cursor-pointer" onClick={() => {
                    loadingSetter(true)
                    router.push(`/blog/${id}`)
                }}>
                    <Image className="w-auto max-w-full" src={cloudinaryURL || '/images/travel.jpg'} alt='/images/travel.jpg' width={200} height={200} />
                </div>
                <div className="w-full flex justify-center pt-2 mb-2 cursor-pointer" onClick={() => {
                    loadingSetter(true)
                    router.push(`/blog/${id}`)
                }}>
                    <p className="text-2xl font-bold">{title}</p>
                </div>
                <p className="max-h-72 bg-gray-200 pb-2 pl-2 pr-2 text-lg overflow-y-scroll">{content} </p>
                <div>
                    <div className='flex justify-center gap-12 bg-gray-100 rounded-b-lg p-2'>
                        <button><FaTrash className="fill-red-500 text-2xl" onClick={deleteBlog} /></button>
                        <button><AiFillEdit className="fill-blue-900 text-2xl hover:pointer" onClick={() => {
                            router.replace(`/edit_blog/${id}`)
                            loadingSetter(true)
                        }} /></button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Card