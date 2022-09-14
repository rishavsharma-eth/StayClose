import React from 'react';
import FileImg from "../img/img.png"
import Attach from "../img/attach.png"

const Input = () => {
    return (
        <div className='input'>
            <input type="text" placeholder='Type something...' />
            <div className="inputOptions">
                <img src={Attach} alt="" />
                <input type="file" style={{ display: "none" }} id="file" />
                <label htmlFor="file">
                    <img src={FileImg} alt="" />
                </label>
                <button>Send</button>
            </div>
        </div>
    )
}

export default Input