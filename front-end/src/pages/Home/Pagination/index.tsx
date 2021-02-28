import { useContext } from "react";
import { RecipeContext } from "src/contexts/Recipe";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './styles.css';

export default function Pagination() {
    const { isFirstPage, isLastPage, loading, nextPage, previousPage } = useContext(RecipeContext);

    return (
        <div className="center-items recipe-pagination">
            <div className="recipe-pagination-button-group">
                <button className="center-items" disabled={isFirstPage || loading} onClick={previousPage}>
                    <FiChevronLeft size="1.5rem" className="w-full" />
                </button>
                <button className="center-items" disabled={isLastPage || loading} onClick={nextPage}>
                    <FiChevronRight size="1.5rem" className="w-full" />
                </button>
            </div>
        </div>
    )
}
