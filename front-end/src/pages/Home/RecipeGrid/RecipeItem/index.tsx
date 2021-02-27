
import './styles.css';
import { IRecipe } from 'src/types/recipe';

interface Props extends IRecipe {
}

export default function RecipeItem({
    title,
    ingredients,
    link,
    gif
}: Props): JSX.Element {

    const openInNewTabDetails = () => {
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <div className="recipe-item">
            <div className="recipe-preview">
                <img src={gif} alt={title} onClick={openInNewTabDetails} />
            </div>
            <div className="recipe-details">
                <div className="recipe-title">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <h3 onClick={openInNewTabDetails}>
                            {title}
                        </h3>
                    </a>
                </div>

                <div className="recipe-ingredients">
                    <strong>Ingredients:</strong> {ingredients.join(', ')}
                </div>

            </div>
        </div>

    )
}