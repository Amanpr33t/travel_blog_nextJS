import Link from "next/link"
import { Fragment } from "react"
function Navbar() {
    
    return (
        <Fragment>
            <nav className="flex flex-row justify-between items-center bg-green-100 h-12 fixed z-50 top-0 w-full " >
                <div>
                    <Link href='/' className='font-medium text-4xl pl-2 pr-2 '>Travel</Link>
                </div>
            </nav>
        </Fragment>
    )
}
export default Navbar