import {Add} from '@mui/icons-material';
import {Fab} from '@mui/material';
import {Link} from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <Fab color="primary" component={Link} to="/channels/new" sx={{float: 'right'}}>
        <Add />
      </Fab>
    </div>
  );
}
