import { checkLogin } from '../controllers/auth.controller';
import { Request, Response } from 'express';

// Setup für die Mocks
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn().mockImplementation((token, secret, callback) => callback(null, { id: 1 })),
}));

jest.mock('../db-func', () => ({
    runQuery: jest.fn().mockResolvedValue(undefined),
    runQueryWithId: jest.fn().mockResolvedValue(123),
}));

jest.mock('../db', () => ({
    run: jest.fn(),
    all: jest.fn(),
}));

describe('createTicket', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    beforeEach(() => {
        mockStatus = jest.fn(() => mockResponse);
        mockJson = jest.fn();

        mockRequest = {
            body: {},
            headers: { 'authorization': 'Bearer validToken' }
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };

        jest.clearAllMocks();
    });

    it('should return 403 if no token is provided', async () => {
        mockRequest.headers = {};
        
        await checkLogin(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({ message: "No token provided." });
    });

});
