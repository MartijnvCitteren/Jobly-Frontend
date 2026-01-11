/**
 * Home Page Tests
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

describe('Home Page', () => {
  it('should render the page', () => {
    render(<Home />)
    expect(screen.getByText('Recruitment')).toBeInTheDocument()
  })

  it('should display the main headline', () => {
    render(<Home />)

    expect(screen.getByText('Recruitment')).toBeInTheDocument()
    expect(screen.getByText('made eazy')).toBeInTheDocument()
  })

  it('should display the tagline', () => {
    render(<Home />)

    expect(screen.getByText(/Creëer professionele vacatureteksten/)).toBeInTheDocument()
  })

  it('should have a link to create vacancy page', () => {
    render(<Home />)

    const links = screen.getAllByRole('link', { name: /vacature|Start nu/i })
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', '/vacancies/create')
  })

  it('should display the Jobzy logo', () => {
    render(<Home />)

    const jobzyElements = screen.getAllByText('Jobzy')
    expect(jobzyElements.length).toBeGreaterThan(0)
  })

  it('should display AI-powered badge', () => {
    render(<Home />)

    expect(screen.getByText('AI-powered recruitment tool')).toBeInTheDocument()
  })

  it('should display feature section', () => {
    render(<Home />)

    expect(screen.getByText('Waarom Jobzy?')).toBeInTheDocument()
  })

  it('should display features', () => {
    render(<Home />)

    expect(screen.getByText('Razendsnel')).toBeInTheDocument()
    expect(screen.getByText('AI-gestuurd')).toBeInTheDocument()
    expect(screen.getByText('Volledig aanpasbaar')).toBeInTheDocument()
  })

  it('should display how it works section', () => {
    render(<Home />)

    expect(screen.getByText('Zo werkt het')).toBeInTheDocument()
  })

  it('should display steps', () => {
    render(<Home />)

    expect(screen.getByText(/Vul de wizard in/)).toBeInTheDocument()
    expect(screen.getByText(/AI genereert/)).toBeInTheDocument()
    expect(screen.getByText(/Pas aan & exporteer|Pas aan/)).toBeInTheDocument()
  })

  it('should display CTA section', () => {
    render(<Home />)

    const ctaElements = screen.getAllByText(/Begin nu gratis|Maak je eerste vacature/)
    expect(ctaElements.length).toBeGreaterThan(0)
  })

  it('should have multiple CTA buttons', () => {
    render(<Home />)

    const ctaButtons = screen.getAllByText(/Maak je eerste vacature|Start nu|Begin nu gratis/i)
    expect(ctaButtons.length).toBeGreaterThan(0)
  })

  it('should display trust indicators', () => {
    render(<Home />)

    expect(screen.getByText('Vertrouwd door recruiters bij')).toBeInTheDocument()
  })

  it('should display demo button', () => {
    render(<Home />)

    expect(screen.getByText('Bekijk demo')).toBeInTheDocument()
  })
})
