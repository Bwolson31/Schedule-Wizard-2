import { useMutation } from '@apollo/client';
import { REMOVE_ACTIVITY } from '../../graphql/mutations';
import { Button } from 'react-bootstrap';

const RemoveActivityButton = ({ activityId, onSuccess }) => {
    const [removeActivity, { loading, error }] = useMutation(REMOVE_ACTIVITY, {
        variables: { activityId },
        onCompleted: () => {
            onSuccess();
        },
        onError: (error) => {
            console.error('Error removing activity:', error);
    
        }
    });

    return (
        <Button disabled={loading} variant="danger" onClick={() => removeActivity()}>
            {loading ? 'Removing...' : 'Remove Activity'}
        </Button>
    );
};

export default RemoveActivityButton;
