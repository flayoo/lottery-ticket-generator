import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';
import { runQuery, runQueryWithId } from '../db-func';
import { LottoTicketDTO } from '../models/token.model';
import { TokenPayload } from '../models/ticket.model';




const verifyToken = (token: string, jwtSecret: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as TokenPayload);
            }
        });
    });
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
    const jwtSecret = process.env.JWT_SECRET as string;
    const ticket = req.body.ticket as LottoTicketDTO;

    if (!ticket || !Array.isArray(ticket.fields)) {
        res.status(400).json({ message: 'Invalid ticket structure' });
        return;
    }

    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <Token>

    if (!token) {
        res.status(403).json({ message: "No token provided." });
        return;
    }

    try {
        const decoded = await verifyToken(token, jwtSecret);
        ticket.userId = decoded.id;

        const ticketId = await runQueryWithId("INSERT INTO tickets (user_id, hasSuperzahl, superzahl) VALUES (?, ?, ?)", [ticket.userId, ticket.hasSuperzahl, ticket.superzahl]);

        for (let field of ticket.fields) {
            const numbersString = field.join(',');
            await runQuery("INSERT INTO fields (ticket_id, numbers) VALUES (?, ?)", [ticketId, numbersString]);
        }

        const tickets = await getTicketsForUser(decoded.id);

        res.status(200).json({ message: 'Ticket created successfully', tickets: tickets });
    } catch (err) {
        res.status(500).json({ message: "Error on the server." });
    }
};

export const allTickets = async (req: Request, res: Response): Promise<void> => {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <Token>

    if (!token) {
        res.status(403).json({ message: "No token provided." });
        return;
    }

    try {
        const decoded = await verifyToken(token, jwtSecret);
        const tickets = await getTicketsForUser(decoded.id);
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: "Error on the server." });
    }
};

async function getTicketsForUser(userId: number): Promise<any[]> {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM tickets WHERE user_id = ?", [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (Array.isArray(rows)) {
            const tickets = await Promise.all(rows.map(async (ticket: any) => {
                const fields_entry = await getFieldsForTicket(ticket.id) as Array<any>;

                const fields = fields_entry.map(item => item.numbers.split(',').map(Number));
            
                return { ...ticket, fields };
            }));

            return tickets;
        } else {
            throw new Error('Ergebnis ist kein Array');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function getFieldsForTicket(ticketId: Number) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM fields WHERE ticket_id = ?", [ticketId], (err, fields) => {
            if (err) reject(err);
            else resolve(fields);
        });
    });
}