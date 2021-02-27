
import './styles.css';
import '../RecipeItem/styles.css';

export default function RecipeItemLoader() {
    return (
        <div className="recipe-item animate-pulse">
            <div className="recipe-preview recipe-bg-loader">

            </div>
            <div className="recipe-details recipe-details-loader">
                <div className="recipe-title recipe-bg-loader">

                </div>

                <div className="recipe-ingredients recipe-bg-loader" >
                </div>
            </div>
        </div>
    )
}
