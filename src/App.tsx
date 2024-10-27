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
          path="/librarian-dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <BookList />
            </>
          }
        />
        <Route
          path="/student-dashboard"
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
          path="/forms/book-creation/:id?"
          element={
            <>
              <PageTitle title="Creacion de libro" />
              <BookCreation />
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
              <PageTitle title="Libreria" />
              <BookList />
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
          path="/tables/reservations"
          element={
            <>
              <PageTitle title="Lista de Reservaciones" />
              <ReservationList />
            </>
          }
        />

      </Routes>
    </>
  );
}

export default App;
