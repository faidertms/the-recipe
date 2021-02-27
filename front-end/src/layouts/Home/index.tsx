import { RecipeContextProvider } from 'src/contexts/Recipe';
import Header from './Header';
import './style.css';

interface Props {
    children: JSX.Element | Array<JSX.Element>;
}

export default function HomeLayout({ children }: Props): JSX.Element {
    return (

        <RecipeContextProvider>
            <Header />
            <main className="main" >
                {children}
            </main>
        </RecipeContextProvider>
    )
}