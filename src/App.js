import logo from './logo.svg';
import './css/App.css';
import Container from 'react-bootstrap/Container';
import TickUrTime from './TickUrTime.js';
import ScheduleForm from './ScheduleForm.js';

function App() {
  return (
    <div>
          <Container>
			<TickUrTime />
          </Container>
    </div>
  );
}

export default App;
