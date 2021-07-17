import style from "../styles/Sandbox.module.scss";
import Link from 'next/link';

var Sandbox = ({ props }) => {
    return (
        <div className={style.List}> 
            <div>
                <h1>{props.title}</h1>
                <hr></hr>
            </div>
            {props.pages.map((post) => (
                <div key={`${post}`}>
                    <div>
                        <a key={`${post}-a`} href={`/sandbox/${encodeURIComponent(post)}`}>
                            <button type="button">
                                <br></br>
                                <h3>{post.toUpperCase()}</h3>
                                <br></br>
                            </button>
                        </a>
                    </div>
                    <a>
                        <br></br>
                    </a>
                </div>
            ))}
        </div>
    )
}

export default Sandbox