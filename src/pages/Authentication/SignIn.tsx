import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginLayout from '../../layout/LoginLayout';
import Logo from '../../images/logo/usac-logo.png';
import LogoDark from '../../images/logo/usac-logo.webp';
import Library from '../../images/product/library.webp';
import LoginDarkModeSwitcher from '../../components/Header/DarkModeSwitcher';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  localStorage.removeItem('Role');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        'http://35.237.124.228/api/v1/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        // Asumiendo que el token está en `data.token`
        const token = data.token;
        console.log('Token:', token);

        // Realizar la segunda petición con el token
        const userInfoResponse = await fetch(
          'http://35.237.124.228/api/v1/users/info',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          sessionStorage.setItem('authToken', data.token);
          localStorage.setItem('UserInfo', JSON.stringify(userInfo.data));
          localStorage.setItem('Role', userInfo.data.role);
          if (userInfo.data.role === 'ADMINISTRATOR') {
            navigate('/administrator-dashboard');
          }else if(userInfo.data.role === 'WAREHOUSE'){
            navigate('/warehouse-dashboard');
          }else if(userInfo.data.role === 'SUPERVISOR'){
            navigate('/supervisor-dashboard');
          }else if(userInfo.data.role === 'STORE'){
            localStorage.setItem('StoreId', userInfo.data.storeId[0]);
            navigate('/store-dashboard');
          }

          // Navegar al dashboard
        } else {
          console.error('Failed to fetch user info');
          showToastMessage();
        }
      } else {
        console.error('Login failed');
        showToastMessage();
      }
    } catch (error) {
      console.error('An error occurred:', error);
      showToastMessage();
    }
  };

  const showToastMessage = () => {
    toast.error('Credenciales incorrectas. Vuelve a intentarlo', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  return (
    <LoginLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="w-full flex justify-end pr-6 pt-6">
          <LoginDarkModeSwitcher />
        </div>
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="w-96 hidden dark:block" src={Logo} alt="Logo" />
                <img className="w-96 dark:hidden" src={LogoDark} alt="Logo" />
              </Link>
              <p className="2xl:px-20">
                Explora el gusto por el conocimiento: ¡Id y enseñad a todos en
                la Biblioteca Universitaria del CUNOC!
              </p>
              <span className="mt-15 inline-block">
                <img className="w-72" src={Library} alt="Logo" />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Empieza ahora</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                 MAXI CLONE
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ingresa tu email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Iniciar sesion"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    No recuerdas tu contraseña?{' '}
                    <Link to="../auth/generate-code" className="text-primary">
                      Recuperar
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </LoginLayout>
  );
};

export default SignIn;
