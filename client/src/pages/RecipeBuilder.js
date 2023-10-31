import { Header } from "../components/header.js"
import { Footer } from "../components/footer.js";
import RecipeMaker from "../components/RecipeMaker.js"
import { useAuth } from '../AuthContext.js';

function RecipeBuilder() {
    const { isLoggedIn } = useAuth();
    return (
        <div>
            <Header /><br/><br/><br/><br/>
            {isLoggedIn ? (
                <RecipeMaker />
            ) : (
                <RecipeMaker />
            )}
        </div>
    );
}

export default RecipeBuilder