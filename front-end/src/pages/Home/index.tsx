import HomeLayout from '../../layouts/Home';
import RecipeGrid from './RecipeGrid';

export default function HomePage(): JSX.Element {
    return (
        <HomeLayout>
            <RecipeGrid />
        </HomeLayout>
    )
}
