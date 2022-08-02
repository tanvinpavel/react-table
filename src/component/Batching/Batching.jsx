import React, { useRef, useState } from 'react';
import Table from './Table';

const Batching = () => {
    const [display, setDisplay] = useState(false);
    const [table, setTable] = useState(false);
    const [sortValue, setSortValue] = useState('all');

    const dateRef = useRef('');
    const sortRef = useRef('');

    const handleChange = (e) => {
        setSortValue(e.target.value);
        setDisplay(true);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const date = dateRef.current.value;
        const sort = sortRef.current.value;

        if(date.length > 0 && sort.length > 0){
            setTable(true);
        }
    }

    return (
        <div className='container mx-auto px-4 py-5'>
            <h1 className='my-5 text-xl font-semibold'>Batching Claim(s)</h1>
            <form onSubmit={submitHandler} className='flex flex-wrap items-end gap-2'>
                <div className="form-control w-36">
                    <label className="label">
                        <span className="label-text text-xs font-semibold">SORT BY</span>
                    </label>
                    <select value={sortValue} onChange={(e)=>handleChange(e)} className="select select-sm select-bordered">
                        <option value='all'>All</option>
                        <option value='patient'>Patient</option>
                        <option value='provider'>Provider</option>
                    </select>
                </div>
                {
                    (display &&  sortValue !== 'all') && <>
                        <div className="form-control w-36">
                            <label className="label">
                                <span className="label-text text-xs font-semibold">{sortValue?.toUpperCase()}</span>
                            </label>
                            <select ref={sortRef} className="select select-sm select-bordered" required>
                                <option value='all'>All</option>
                                <option value='patient'>Patient</option>
                                <option value='provider'>Provider</option>
                            </select>
                        </div>
                        <div className="form-control w-36">
                            <label className="label">
                                <span className="label-text text-xs font-semibold">DATE</span>
                            </label>
                            <input type="date" ref={dateRef} className='input input-sm input-bordered cursor-pointer' required />
                        </div>
                    </>
                }
                <button type='submit' className='btn btn-sm text-xs'>Go</button>
                <button type="reset" onClick={()=>setDisplay(false) } className='btn btn-sm text-xs'>Cancel</button>
                {
                    table && <>
                        <button type='button' className='btn btn-sm text-xs'>Generate Batch</button>
                        <button type='button' className='btn btn-sm text-xs'>Generate CSV</button>
                    </>
                }
            </form>
            <div>{
                table && <Table/>
            }</div>
        </div>
    );
};

export default Batching;