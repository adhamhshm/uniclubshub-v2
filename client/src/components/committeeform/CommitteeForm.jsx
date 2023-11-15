import "./committeeform.scss";
import { makeRequest } from "../../request";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

import CloseIcon from '@mui/icons-material/CloseOutlined';

const positionType = [
    {position: "President", value: 1},
    {position: "Deputy President", value : 2},
    {position: "Vice President", value : 3},
    {position: "Treasurer", value : 4},
    {position: "Secretary", value : 5},
    {position: "Bureau Head", value : 6},
    {position: "Bureau Member", value : 7},
]

const CommitteeForm = ({ setOpenUpdateBox, writeMode, userId, committeeInfo }) => {

    const queryClient = useQueryClient();
    const [committeeInputs, setCommitteeInputs] = useState({
        position: committeeInfo.position || "",
        name: committeeInfo.name || "",
        rank: committeeInfo.rank || 0,
    });

    // Mutation for adding a new post
    const addCommitteeMutation = useMutation(async (newCommittee) => {
        try {
            return await makeRequest.post("/committees", newCommittee);
        } catch (error) {
            alert(error.response.data);
            throw error;
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["committeeList"]);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommitteeInputs((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWriteCommitee = async (e) => {
        e.preventDefault();
        if (writeMode === "Add") {
            await addCommitteeMutation.mutate({ position: committeeInputs.position, name: committeeInputs.name, rank: committeeInputs.rank });
        }
        setOpenUpdateBox(false);
    };

    return (
        <div className="committee-form">
            <div className="wrapper">
                <h1><span>{writeMode}</span> Commitee</h1>
                <form>
                    {/* position input */}
                    <label>Position Name</label>
                    <input type="text" value={committeeInputs.position} name="position" onChange={handleChange} autoComplete="off" />
                    {/* position input */}
                    <label>Position Type</label>
                    <select id="position-type" name="rank" onChange={handleChange} value={committeeInputs.rank}>
                        <option value="0">Select:</option>
                        {positionType.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.position}
                            </option>
                        ))}
                    </select>
                    {/* name input */}
                    <label>Commitee Name</label>
                    <input type="text" value={committeeInputs.name} name="name" onChange={handleChange} autoComplete="off" />
                    <button onClick={handleWriteCommitee}> 
                        {writeMode}
                    </button>
                </form>
                <CloseIcon className="close" style={{cursor: "pointer", width: "30px", height: "30px"}} onClick={() => setOpenUpdateBox(false)} />
            </div>
        </div>
    )
}

export default CommitteeForm;