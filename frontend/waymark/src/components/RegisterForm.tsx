export default function RegistorForm() {
    return (
        <div className="p-20 m-20">
            <h1>SignUp Page</h1>
            <form>
                <div className = "mb-4">
                    <label htmlFor="email">Email:</label>
                    <input className="bg-amber-50"
                        type="email"
                        id="email"
                        name="email"
                        required
                        />
                </div>
                <div className = "mb-4">
                    <label htmlFor="password">Password:</label>
                    <input className ="bg-amber-50"
                        type="password"
                        id="password"
                        name="password"
                        required
                        />
                </div>
                <div className="p-5 bg-amber-300">
                    <button className="bg-amber-300 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded"
                    type="submit"> Sign Up</button>
                </div>
            </form>
        </div>
    );
}
