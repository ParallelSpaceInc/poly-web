
type props = {
  logOut: () => void
}

const UserMenuModal = ({ logOut }: props) => {

  return (
    <div className={'absolute mt-2 right-8 border border-gray-300 rounded shadow-md bg-white shadow-slate-400 z-10'}>
      <ul className={'divide-y cursor-pointer divide-slate-300'} >
        <li className={'px-16 py-4  text-center'}>
          마이페이지
        </li>
        <li onClick={logOut} className={'px-16 py-4 text-center'}>
          로그아웃
        </li>
      </ul >
    </div >
  )

}

export default UserMenuModal