import { ToastContainer } from 'react-toastify';
import HomeLayout from '../../layouts/Home';
import RecipeGrid from './RecipeGrid';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage(): JSX.Element {
    return (
        <HomeLayout>
            <RecipeGrid />
            <ToastContainer />
        </HomeLayout>
    )
}
