import { usePrivy } from "@privy-io/react-auth";

function Login() {
    const { authenticated, login, logout } = usePrivy();
  return (
    <>
    { !authenticated ? 
      <button
      className="bg-gray-600 hover:bg-gray-700 py-2 px-4  text-white rounded-lg"
      onClick={login}
    >Login</button>
    :
  <button
    className="bg-gray-600 hover:bg-gray-700 py-2 px-4 text-white rounded-lg text-xs"
    onClick={logout}
  >Logout</button>
  }
    </>
    )
}

export default Login