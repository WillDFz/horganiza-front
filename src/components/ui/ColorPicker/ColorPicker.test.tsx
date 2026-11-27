import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColorPicker from './index';

// Mock react-color
jest.mock('react-color', () => ({
  SketchPicker: ({ onChangeComplete, color }: { onChangeComplete: (color: { hex: string }) => void; color: string }) => (
    <div data-testid="sketch-picker">
      <button
        onClick={() => onChangeComplete({ hex: '#ff0000' })}
        data-testid="color-button"
      >
        Select Color
      </button>
      <span>{color}</span>
    </div>
  ),
}));

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render color picker with label', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    expect(screen.getByText(/primary color/i)).toBeInTheDocument();
  });

  it('should render color preview button', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const colorButton = screen.getByLabelText(/selecionar primary color/i);
    expect(colorButton).toBeInTheDocument();
  });

  it('should show color picker when button is clicked', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const colorButton = screen.getByLabelText(/selecionar primary color/i);
    fireEvent.click(colorButton);

    expect(screen.getByTestId('sketch-picker')).toBeInTheDocument();
  });

  it('should hide color picker when clicking outside', async () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const colorButton = screen.getByLabelText(/selecionar primary color/i);
    fireEvent.click(colorButton);

    expect(screen.getByTestId('sketch-picker')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId('sketch-picker')).not.toBeInTheDocument();
    });
  });

  it('should call onChange when color is selected', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const colorButton = screen.getByLabelText(/selecionar primary color/i);
    fireEvent.click(colorButton);

    const selectButton = screen.getByTestId('color-button');
    fireEvent.click(selectButton);

    expect(mockOnChange).toHaveBeenCalledWith('#ff0000');
  });

  it('should update hex input value', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const hexInput = screen.getByLabelText(/código hexadecimal/i) as HTMLInputElement;
    fireEvent.change(hexInput, { target: { value: '#123456' } });

    expect(mockOnChange).toHaveBeenCalledWith('#123456');
  });

  it('should not update hex input value for invalid hex', () => {
    render(<ColorPicker label="Primary Color" value="#000000" onChange={mockOnChange} />);

    const hexInput = screen.getByLabelText(/código hexadecimal/i) as HTMLInputElement;
    fireEvent.change(hexInput, { target: { value: '#invalid' } });

    expect(mockOnChange).not.toHaveBeenCalledWith('#invalid');
  });
});

