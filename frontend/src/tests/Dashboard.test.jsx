import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../components/Dashboard';
import { api } from '../services/api';

// Mock API
vi.mock('../services/api', () => ({
    api: {
        getTripSummary: vi.fn(),
        getTopRegions: vi.fn(),
        geocode: vi.fn()
    }
}));

// Mock Assets
vi.mock('../assets/banner.png', () => ({ default: 'banner.png' }));

describe('Dashboard Component', () => {
    it('renders dashboard title', () => {
        // Return empty promises to prevent unhandled rejection during render
        api.getTripSummary.mockResolvedValue({});
        api.getTopRegions.mockResolvedValue([]);

        render(<Dashboard />);
        expect(screen.getByText('GlobeTrotter')).toBeInTheDocument();
    });

    it('loads and displays regions', async () => {
        const mockRegions = [
            { name: 'Paris', placeCount: 10, imageUrl: 'paris.jpg' },
            { name: 'Rome', placeCount: 5, imageUrl: 'rome.jpg' }
        ];
        api.getTripSummary.mockResolvedValue({});
        api.getTopRegions.mockResolvedValue(mockRegions);

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Paris')).toBeInTheDocument();
            expect(screen.getByText('10 places')).toBeInTheDocument();
        });
    });
});
