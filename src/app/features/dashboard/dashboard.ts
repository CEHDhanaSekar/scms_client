import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserSignal } from '../../services/signals/user.signal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-xl font-semibold text-content">
          Good morning, {{ userSignal.user()?.username || 'User' }}
        </h1>
        <p class="text-sm text-content-subtle">{{ today | date: 'EEEE, MMMM d, y' }}</p>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <p class="text-xs text-content-subtle">Total Patients</p>
          <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
        </div>
        <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <p class="text-xs text-content-subtle">Total Employees</p>
          <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
        </div>
        <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <p class="text-xs text-content-subtle">Departments</p>
          <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
        </div>
        <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <p class="text-xs text-content-subtle">Active Users</p>
          <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
        </div>
      </div>

      <!-- Recent activity + quick actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <h2 class="text-sm font-medium text-content mb-3">Recently added patients</h2>
          <!-- p-table or simple list here -->
          <div class="text-sm text-content-subtle py-8 text-center">No recent patients found.</div>
        </div>
        <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
          <h2 class="text-sm font-medium text-content mb-3">Quick actions</h2>
          <button
            class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-container text-sm text-content mb-1 transition-colors"
          >
            + Add patient
          </button>
          <button
            class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-container text-sm text-content transition-colors"
          >
            + Add employee
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  readonly userSignal = inject(UserSignal);
  readonly today = new Date();
}
