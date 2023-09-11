import { Fragment, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/router"

function AddEditForm(props) {
    const router = useRouter()
    const [title, setTilte] = useState('')
    const [content, setContent] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [contentError, setContentError] = useState(false)
    const [file, setFile] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (props.isEdit) {
            setContent(props.content)
            setTilte(props.title)
            setCreateObjectURL(props.cloudinaryURL)
        }
    }, [props.isEdit])

    const imageChangeHandler = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setCreateObjectURL(URL.createObjectURL(event.target.files[0]));
        }
    }

    const imageUpload = async () => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append('upload_preset', 'travelBlog');
            //formData.append('cloud_name', 'dyo3cpox3');
            const response = await fetch('https://api.cloudinary.com/v1_1/dyo3cpox3/image/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            return data.secure_url
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    const formSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        let cloudinaryURL = null
        if (file) {
            cloudinaryURL = await imageUpload()
        }
        if (!title.trim() || !content.trim()) {
            if (!title.trim()) {
                setTitleError(true)
            }
            if (!content.trim()) {
                setContentError(true)
            }
            setLoading(false)
            return
        }

        let body
        if (props.isEdit && !cloudinaryURL) {
            body = { title, content }
        } else if (props.isEdit && cloudinaryURL) {
            body = { title, content, cloudinaryURL }
        } else {
            body = { title, content, cloudinaryURL: cloudinaryURL || null }
        }

        try {
            const response = await fetch(`${props.isEdit ? `/api/blog/edit/${props.blogId}` : '/api/blog'}`, {
                method: `${props.isEdit ? 'PATCH' : 'POST'}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                router.replace('/')
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    return (
        <Fragment>
            {loading && <div className="w-full mt-48 flex justify-center">
                <p className="text-base font-medium">Loading...</p>
            </div>}
            {!loading && <div className="fixed top-14">
                <button className="rounded-lg bg-green-700 p-1 text-base font-medium text-white ml-1" onClick={() => {
                    router.replace('/')
                    setLoading(true)
                }}>Back to home</button>
            </div>}
            {!loading && error && <div className="w-full pt-48 flex flex-col place-items-center cursor-pointer">
                <p className="text-base font-medium">Some error occured.</p>
                <p className="text-base font-medium text-red-500" onClick={() => setError(false)}>Try again</p>
            </div>}
            {!loading && !error && <Fragment><div className="min-h-screen w-full pt-24 pl-2 pr-2 flex flex-col  place-items-center">
                <div className="bg-gray-200 p-2 w-11/12 md:w-10/12  lg:w-3/4">
                    <form onSubmit={formSubmit} className="flex flex-col">
                        <label className="text-lg font-medium" htmlFor="title">Title</label>
                        <input type="text" className="border-2 border-gray-400 pl-1 pr-1 overflow-x-scroll" id="title" name="title" placeholder="Enter title here..." autoComplete="off" value={title} onChange={e => {
                            setTilte(e.target.value.trimStart())
                            setTitleError(false)
                        }} onBlur={() => !title ? setTitleError(true) : setTitleError(false)}></input>
                        {titleError && <p className="text-red-500 ">Please enter a title</p>}

                        <label className="text-lg font-medium mt-2" htmlFor="content">Content</label>
                        <textarea className="border-2 border-gray-400 pl-1 pr-1 resize-none overflow-y-scroll" id="content" name="content" placeholder="Enter content here..." rows={8} value={content} onChange={e => {
                            setContent(e.target.value.trimStart())
                            setContentError(false)
                        }} onBlur={() => !content ? setContentError(true) : setContentError(false)}></textarea>
                        {contentError && <p className="text-red-500 ">Please enter some content</p>}

                        <div className="flex flex-row justify-between sm:justify-normal mt-4 ">
                            <input type="file" name='image' placeholder="image" accept="image/*" onChange={imageChangeHandler} />
                            {createObjectURL && <Image className="w-auto max-h-40" src={createObjectURL || '/images/travel.jpg'} alt='/images/travel.jpg' width={200} height={200} />}
                        </div>
                        <div className='mt-3 mb-2 flex justify-center'>
                            <button type="submit" className="bg-green-500 text-gray-50 font-medium p-1.5 rounded-lg">Submit</button>
                        </div>
                    </form>
                </div>
            </div></Fragment>}

        </Fragment>
    )
}

export default AddEditForm