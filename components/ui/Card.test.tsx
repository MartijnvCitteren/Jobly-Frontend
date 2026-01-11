import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card'

describe('Card Component', () => {
  describe('Card', () => {
    it('should render children', () => {
      render(<Card>Card content</Card>)

      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply default padding (md)', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-6')
    })

    it('should apply no padding', () => {
      const { container } = render(<Card padding="none">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('p-4', 'p-6', 'p-8')
    })

    it('should apply small padding', () => {
      const { container } = render(<Card padding="sm">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-4')
    })

    it('should apply large padding', () => {
      const { container } = render(<Card padding="lg">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('p-8')
    })

    it('should apply hover styles when hover prop is true', () => {
      const { container } = render(<Card hover>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('hover:shadow-md')
    })

    it('should not apply hover styles by default', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('hover:shadow-md')
    })

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('Card with onClick', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable card</Card>)

      const card = screen.getByRole('button')
      await user.click(card)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should have role="button" when onClick is provided', () => {
      render(<Card onClick={() => {}}>Clickable</Card>)

      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
    })

    it('should be keyboard accessible with Enter key', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable</Card>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be keyboard accessible with Space key', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable</Card>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should have tabIndex when onClick is provided', () => {
      render(<Card onClick={() => {}}>Clickable</Card>)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '0')
    })
  })

  describe('CardHeader', () => {
    it('should render children', () => {
      render(<CardHeader>Header content</CardHeader>)

      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>)

      const header = screen.getByText('Header')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('should render children', () => {
      render(<CardTitle>Title</CardTitle>)

      expect(screen.getByText('Title')).toBeInTheDocument()
    })

    it('should render as h3 element', () => {
      render(<CardTitle>Title</CardTitle>)

      const title = screen.getByText('Title')
      expect(title.tagName).toBe('H3')
    })

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>)

      const title = screen.getByText('Title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('should render children', () => {
      render(<CardDescription>Description text</CardDescription>)

      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('should render as p element', () => {
      render(<CardDescription>Description</CardDescription>)

      const description = screen.getByText('Description')
      expect(description.tagName).toBe('P')
    })

    it('should apply custom className', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>)

      const description = screen.getByText('Description')
      expect(description).toHaveClass('custom-desc')
    })
  })

  describe('CardContent', () => {
    it('should render children', () => {
      render(<CardContent>Content</CardContent>)

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>)

      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('should render children', () => {
      render(<CardFooter>Footer</CardFooter>)

      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>)

      const footer = screen.getByText('Footer')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Composed Card', () => {
    it('should render all sub-components together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description goes here')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })
})
