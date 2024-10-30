import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';

import BookCreation from './pages/Form/BookCreation';
import LoanCreation from './pages/Form/LoanCreation';
import ReservationCreation from './pages/Form/ReservationCreation';
import UserCreation from './pages/Form/UserCreation';
import CarreerCreation from './pages/Form/CarreerCreation';
import LibrarianDashboard from './pages/Dashboard/LibrarianDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import CarrerList from './pages/Tables/CarreerList';
import BookList from './pages/Tables/BookList';
import UserList from './pages/Tables/UserList';
import ReservationList from './pages/Tables/ReservationList';
import StoresList from './pages/Tables/StoreList';
import StoreCreation from './pages/Form/StoreCreation';
import OrderList from './pages/Tables/ReservationList';
import ShipmentsList from './pages/Tables/ShipmentsList';
import GeneratePasswordCode from './pages/Authentication/GeneratePasswordCode';
import ResetPassword from './pages/Authentication/RecoverPassword';
import CatalogStore from './pages/Tables/CatalogStoreLit';
import OrderCreation from './pages/Form/OrderCreation';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Sign In" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/administrator-dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <BookList />
            </>
          }
        />
        <Route
          path="/store-dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <BookList />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | CUNOC Library - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Inicio de sesion" />
              <SignUp />
            </>
          }
        />
         <Route
          path="/auth/generate-code"
          element={
            <>
              <PageTitle title="Generar Codigo" />
              <GeneratePasswordCode />
            </>
          }
        />
         <Route
          path="/auth/reset-password/:email?/:code?"
          element={
            <>
              <PageTitle title="Recover Password" />
              <ResetPassword />
            </>
          }
        />
        <Route
          path="/forms/book-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de libro" />
              <BookCreation />
            </>
          }
        />
        <Route
          path="/forms/store-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de tienda" />
              <StoreCreation />
            </>
          }
        />
        <Route
          path="/forms/loan-creation"
          element={
            <>
              <PageTitle title="Registro de prestamo" />
              <LoanCreation />
            </>
          }
        />
        <Route
          path="/forms/reservation-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de reservacion" />
              <ReservationCreation />
            </>
          }
        />

        <Route
          path="/forms/user-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de usuarios" />
              <UserCreation />
            </>
          }
        />

<Route
          path="/forms/create-order/:id?"
          element={
            <>
              <PageTitle title="Creacion de ordenes" />
              <OrderCreation />
            </>
          }
        />

        <Route
          path="/forms/carreer-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de carrera" />
              <CarreerCreation />
            </>
          }
        />

        <Route
          path="/tables/carreers"
          element={
            <>
              <PageTitle title="Lista de Carreras" />
              <CarrerList />
            </>
          }
        />

        <Route
          path="/tables/books"
          element={
            <>
              <PageTitle title="Catalogo General" />
              <BookList />
            </>
          }
        />

<Route
          path="/tables/products-store"
          element={
            <>
              <PageTitle title="Catalogo De Tienda" />
              <CatalogStore />
            </>
          }
        />

      <Route
          path="/tables/users"
          element={
            <>
              <PageTitle title="Lista de Usuarios" />
              <UserList />
            </>
          }
        />

    <Route
          path="/tables/orders"
          element={
            <>
              <PageTitle title="Lista de Ordenes" />
              <OrderList />
            </>
          }
        />

<Route
          path="/tables/orders"
          element={
            <>
              <PageTitle title="Lista de Ordenes" />
              <OrderList />
            </>
          }
        />
    <Route
          path="/tables/shipments"
          element={
            <>
              <PageTitle title="Lista de Envios" />
              <ShipmentsList />
            </>
          }
        />
      <Route
          path="/tables/stores"
          element={
            <>
              <PageTitle title="Lista de Tiendas" />
              <StoresList />
            </>
          }
        />

      </Routes>
    </>
  );
}

export default App;
