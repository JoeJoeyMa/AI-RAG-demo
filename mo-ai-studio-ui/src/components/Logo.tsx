import { Link } from "@nextui-org/link"
import logo from "../../public/assets/logo.png"

export default ({ size = 22, color = "text-white", text = "Mobenai", href = "/" }) => {
  return (
    <>
      <img height={size} width={size} className={`rounded-lg mr-1`} src={logo} alt='logo' />
      <p className='font-bold text-inherit text-2xl'>
        <Link className={`${color} text-[26px]`} href={href}>
          {text}
        </Link>
      </p>
    </>
  )
}
