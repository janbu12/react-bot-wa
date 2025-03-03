import React, { useState } from 'react'
import CommandForm from '../../components/CommandForm'

function AddCommand() {
    const [refresh, setRefresh] = useState(false);
    return (
        <CommandForm onCommandAdded={() => setRefresh(!refresh)} />
    )
}

export default AddCommand