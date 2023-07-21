function Login() {
  return (
    <div
      className="bg-no-repeat bg-contain h-screen w-full"
      style={{ backgroundImage: `url(..)` }}
    >
      <div className="container mx-auto flex flex-wrap">
        <div className="w-full sm:w-1/2">
          {/* <img src={Logo} alt="logo-amda" className="mx-auto mt-16 w-52 h-56" /> */}
        </div>
        <div className="w-full sm:w-1/2 bg-red-800">
          <div className="mt-16 space-y-8">
            <div className="px-2">
              <h2 className="font-poppins font-bold text-white text-center text-3xl">
                Access Maintenance
              </h2>
              <h2 className="font-poppins font-bold text-white text-center text-3xl">
                Dashboard Apps
              </h2>
            </div>
            <div className="px-2 h-8"></div>
            <div className="px-2">
              <h6 className="font-poppins font-regular text-white text-center">
                Masuk ke akun Anda
              </h6>
            </div>
            <div className="px-2">
              <form className="font-poppins font-normal text-white mx-auto w-1/2">
                <div className="mb-3">
                  <input
                    type="username"
                    placeholder="Username"
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none"
                  />
                </div>
              </form>
            </div>
            <div className="px-2 flex justify-center items-center">
              <button
                type="submit"
                className="w-24 mx-auto bg-black text-white py-2 px-4 rounded"
              >
                Login
              </button>
            </div>
            <div className="px-2 h-44"></div>
            <div className="px-2 h-44"></div>
            <div className="px-2 h-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
