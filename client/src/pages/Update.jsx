import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ONE_SCHEDULE } from '../graphql/queries';
import { UPDATE_SCHEDULE } from '../graphql/mutations';


export default function Update() {
    const { scheduleId } = useParams()

    const { data, loading } = useQuery(GET_ONE_SCHEDULE, {
        variables: { scheduleId: scheduleId }
    })

    const [updateSchedule] = useMutation(UPDATE_SCHEDULE)
    const scheduleData = data?.getOneSchedule || {}

    const [title, setTitle] = useState('');
    //console.log(scheduleData);

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log({ scheduleId, title });
        try {
       
            const { data } = await updateSchedule({
                variables: {
                    scheduleId: scheduleId,
                    title: title
                }
            })
            document.location.replace('/profile')

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Form
                onSubmit={handleSubmit}
            >
                <Form.Group className="mb-3">
                    <Form.Label>Schedule Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={scheduleData.title}
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Button type='submit'>Submit</Button>
                </Form.Group>
            </Form>

        </div>
    )
}