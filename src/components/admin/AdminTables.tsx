'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch (e) {
        return 'N/A';
    }
};

const formatDateTime = (dateStr: string) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
        return new Date(dateStr).toLocaleString();
    } catch (e) {
        return 'N/A';
    }
};

export interface UserData {
    id: string;
    email: string;
    fullName: string;
    signupDate: string;
    totalAnalyses: number;
    lastActive: string;
    plan: string;
}

export interface AnalysisData {
    id: string;
    repoUrl: string;
    userEmail: string;
    createdAt: string;
    status: string;
}

interface AdminTablesProps {
    users: UserData[];
    analyses: AnalysisData[];
}

export function AdminTables({ users, analyses }: AdminTablesProps) {
    const [mounted, setMounted] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [userSortField, setUserSortField] = useState<keyof UserData>('signupDate');
    const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        return users
            .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
            .sort((a, b) => {
                const valA = a[userSortField];
                const valB = b[userSortField];

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return userSortOrder === 'asc'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return userSortOrder === 'asc' ? valA - valB : valB - valA;
                }

                return 0;
            });
    }, [users, userSearch, userSortField, userSortOrder]);

    const toggleUserSort = (field: keyof UserData) => {
        if (userSortField === field) {
            setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setUserSortField(field);
            setUserSortOrder('desc');
        }
    };

    if (!mounted) {
        return (
            <div className="space-y-12 py-10">
                <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
                <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* SECTION B — User Table */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold tracking-tight">Users</h2>
                    <div className="w-64">
                        <Input
                            placeholder="Search by email..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="h-9 text-sm"
                        />
                    </div>
                </div>

                <div className="rounded-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                                <th
                                    className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                                    onClick={() => toggleUserSort('signupDate')}
                                >
                                    Signup Date {userSortField === 'signupDate' && (userSortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground text-center"
                                    onClick={() => toggleUserSort('totalAnalyses')}
                                >
                                    Total Analyses {userSortField === 'totalAnalyses' && (userSortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Last Active</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Plan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{user.email}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDate(user.signupDate)}
                                    </td>
                                    <td className="px-4 py-3 text-center">{user.totalAnalyses}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDate(user.lastActive)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="font-normal">{user.plan}</Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SECTION C — Recent Analyses */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Recent Analyses</h2>
                <div className="rounded-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Repo URL</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">User Email</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Created At</th>
                                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analyses.length > 0 ? analyses.map((analysis) => (
                                <tr key={analysis.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 max-w-xs truncate font-mono text-xs">
                                        {analysis.repoUrl}
                                    </td>
                                    <td className="px-4 py-3">{analysis.userEmail}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDateTime(analysis.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={analysis.status === 'completed' ? 'secondary' : analysis.status === 'failed' ? 'destructive' : 'outline'}
                                            className="capitalize"
                                        >
                                            {analysis.status}
                                        </Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No analyses found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
