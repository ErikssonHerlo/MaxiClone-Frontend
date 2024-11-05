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
import OrderView from './pages/Form/OrderView';
import ShipmentView from './pages/Form/ShipmentView';
import ReportStoreProduct from './pages/Form/ReportStoreProduct';
import ReportOrdersTimeStatus from './pages/Form/ReportOrdersTimeStatus';
import ReportShipmentTime from './pages/Form/ReportShipmentTime';

import ReportShipmentTimeStore from './pages/Form/ReportShipmentTimeStore';
import ReportTop5StoresOrdersTimeStatus from './pages/Form/ReportTop5StoresOrdersTimeStatus';
import ReportTop5UsersOrdersTime from './pages/Form/ReportTop5UsersOrdersTime';
import ReportTop5ProductsOrdersTime from './pages/Form/ReportTop5ProductsOrdersTime';
import ReportTop5UsersShipmentsTime from './pages/Form/ReportTop5UsersShipmentsTime';
import IncidentCreation from './pages/Form/IncidentCreation';
import IncidentsList from './pages/Tables/IncidentsList';
import IncidentView from './pages/Form/IncidentView';
import ReportIncidentsTimeStatus from './pages/Form/ReportIncidentsTimeStatus';
import ReportIncidentsTimeStatusStore from './pages/Form/ReportIncidentsTimeStatusStore';
import DevolutionCreation from './pages/Form/DevolutionCreation';
import DevolutionsList from './pages/Tables/DevolutionsList';
import DevolutionView from './pages/Form/DevolutionView';
import ReportDevolutionsTimeStatus from './pages/Form/ReportDevolutionsTimeStatus';
import ReportDevolutionsTimeStatusStore from './pages/Form/ReportDevolutionsTimeStatusStore';
import ReportDamageProductosTimeStore from './pages/Form/ReportDamagedProductsTimeStatusStore';
import ReportOrdersTimeStatusStore from './pages/Form/ReportOrdersTimeStatusStore';

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
          path="/supervisor-dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <OrderList />
            </>
          }
        />
          <Route
          path="/warehouse-dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <OrderList />
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
              <PageTitle title="Creacion de Porducto" />
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
          path="/forms/reports/store-products"
          element={
            <>
              <PageTitle title="Reporte de productos de tienda" />
              <ReportStoreProduct />
            </>
          }
        />

<Route
          path="/forms/reports/orders-time"
          element={
            <>
              <PageTitle title="Reporte de ordenes por tiempo" />
              <ReportOrdersTimeStatus />
            </>
          }
        />

<Route
          path="/forms/reports/incidents-time"
          element={
            <>
              <PageTitle title="Reporte de incidentes por tiempo" />
              <ReportIncidentsTimeStatus />
            </>
          }
        />

<Route
          path="/forms/reports/devolutions-time"
          element={
            <>
              <PageTitle title="Reporte de devoluciones por tiempo" />
              <ReportDevolutionsTimeStatus />
            </>
          }
        />

<Route
          path="/forms/reports/incidents-time-store"
          element={
            <>
              <PageTitle title="Reporte de incidentes por tiempo y tienda" />
              <ReportIncidentsTimeStatusStore />
            </>
          }
        />

<Route
          path="/forms/reports/devolutions-time-store"
          element={
            <>
              <PageTitle title="Reporte de devoluciones por tiempo y tienda" />
              <ReportDevolutionsTimeStatusStore />
            </>
          }
        />

<Route
          path="/forms/reports/shipment-time"
          element={
            <>
              <PageTitle title="Reporte de envios por tiempo" />
              <ReportShipmentTime />
            </>
          }
        />

<Route
          path="/forms/reports/shipment-time-store"
          element={
            <>
              <PageTitle title="Reporte de envios por tiempo" />
              <ReportShipmentTimeStore />
            </>
          }
        />

<Route
          path="/forms/reports/orders-time-store"
          element={
            <>
              <PageTitle title="Reporte de ordenes por tiempo y tienda" />
              <ReportOrdersTimeStatusStore />
            </>
          }
        />

<Route
          path="/forms/reports/damaged-products-time"
          element={
            <>
              <PageTitle title="Reporte de productos daniados por tiempo y tienda" />
              <ReportDamageProductosTimeStore />
            </>
          }
        />

<Route
          path="/forms/reports/top-5-stores-time"
          element={
            <>
              <PageTitle title="Reporte top 5 tiendas" />
              <ReportTop5StoresOrdersTimeStatus />
            </>
          }
        />


<Route
          path="/forms/reports/top-5-users-shipments-time"
          element={
            <>
              <PageTitle title="Reporte top 5 usuarios con envios" />
              <ReportTop5UsersShipmentsTime />
            </>
          }
        />


<Route
          path="/forms/reports/top-5-users-orders-time"
          element={
            <>
              <PageTitle title="Reporte top 5 usuarios con ordenes" />
              <ReportTop5UsersOrdersTime />
            </>
          }
        />

<Route
          path="/forms/reports/top-products-requested-time"
          element={
            <>
              <PageTitle title="Reporte top productos mas pedidos" />
              <ReportTop5ProductsOrdersTime />
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
          path="/forms/create-order/:id?/view"
          element={
            <>
              <PageTitle title="Creacion de ordenes" />
              <OrderView />
            </>
          }
        />

<Route
          path="/forms/create-order/:id?/view"
          element={
            <>
              <PageTitle title="Creacion de ordenes" />
              <OrderView />
            </>
          }
        />

    <Route
          path="/forms/shipment-creation/:id?/view"
          element={
            <>
              <PageTitle title="Ver envio" />
              <ShipmentView />
            </>
          }
        />

<Route
          path="/forms/shipment-creation/:id?/incident"
          element={
            <>
              <PageTitle title="Crear Incidencia" />
              <IncidentCreation />
            </>
          }
        />

<Route
          path="/forms/shipment-creation/:id?/devolution"
          element={
            <>
              <PageTitle title="Crear Devolucion" />
              <DevolutionCreation />
            </>
          }
        />


<Route
          path="/forms/incident-creation/:id?/view"
          element={
            <>
              <PageTitle title="Ver Incidencia" />
              <IncidentView />
            </>
          }
        />

<Route
          path="/forms/devolution-creation/:id?/view"
          element={
            <>
              <PageTitle title="Ver Devolucion" />
              <DevolutionView />
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
          path="/tables/incidents"
          element={
            <>
              <PageTitle title="Lista de Incidentes" />
              <IncidentsList />
            </>
          }
        />
          <Route
          path="/tables/devolutions"
          element={
            <>
              <PageTitle title="Lista de Devoluciones" />
              <DevolutionsList />
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
