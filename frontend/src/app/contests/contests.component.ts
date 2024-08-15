import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

interface Contest {
  _id: string;
  contestName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  maxParticipants: number;
  registrationOpen: boolean;
  participants: any[];
}

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css'],
})
export class ContestsComponent implements OnInit {
  contests: Contest[] = [];
  contestIds: string[] = [];
  selectedContestId: string | null = null; // Selected contest ID
  isLoading = true;
  errorMessage: string | null = null;
  apiUrl: string = environment.API_PATH + '/contest';
  headers = { 'Content-Type': 'application/json' };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getActiveContests();
  }

  getAllContestIds(): void {
    this.http
      .post<Contest[]>(
        `${this.apiUrl}/getAllContests`,
        { ACCESS_TOKEN: this.cookieService.get('ACCESS_TOKEN') },
        { headers: this.headers }
      )
      .subscribe(
        (data) => {
          this.contests = data;
          this.contestIds = data.map((contest) => contest._id);
          if (this.contestIds.length > 0) {
            this.selectedContestId = this.contestIds[0]; // Default to the first contest
          }
        },
        (error) => {
          this.errorMessage = 'Error fetching all contests';
          this.isLoading = false;
        }
      );
  }

  register(contestId: string | null): void {
    if (!contestId) {
      this.errorMessage = 'Invalid contest ID.';
      return;
    }

    const username = this.cookieService.get('username');
    const accessToken = this.cookieService.get('ACCESS_TOKEN');
    if (!username || !accessToken) {
      this.errorMessage = 'Please login to register for contests';
      return;
    }

    const registrationData = {
      ACCESS_TOKEN: accessToken,
      username,
      contestId,
    };
    this.http
      .post(`${this.apiUrl}/registerUser`, registrationData, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          alert('Successfully registered!');
          this.getActiveContests();
        },
        (error) => {
          console.log(error);
          this.errorMessage = error.error.message;
        }
      );
  }

  changeStatus(contestId: string | null, status: string): void {
    if (!contestId) {
      this.errorMessage = 'Invalid contest ID.';
      return;
    }

    const accessToken = this.cookieService.get('ACCESS_TOKEN');
    const statusData = { contestId, status, ACCESS_TOKEN: accessToken };
    this.http
      .post(`${this.apiUrl}/changeStatus`, statusData, {
        headers: this.headers,
      })
      .subscribe(
        (response) => {
          alert('Status updated successfully!');
          this.getActiveContests(); // Refresh contests after status change
        },
        (error) => {
          this.errorMessage = 'Error updating contest status';
        }
      );
  }

  viewLeaderboard(contestId: string | null): void {
    const accessToken = this.cookieService.get('ACCESS_TOKEN');
    this.http
      .post(
        `${this.apiUrl}/getLeaderBoard`,
        { contestId, ACCESS_TOKEN: accessToken },
        { headers: this.headers }
      )
      .subscribe(
        (response: any) => {
          console.log(response.leaderboard);
          alert('Leaderboard fetched successfully. Check console for details.');
        },
        (error) => {
          this.errorMessage = 'Error fetching leaderboard';
        }
      );
  }

  getPastContests(): void {
    const accessToken = this.cookieService.get('ACCESS_TOKEN');
    this.http
      .post<Contest[]>(
        `${this.apiUrl}/getPastContests`,
        { ACCESS_TOKEN: accessToken },
        { headers: this.headers }
      )
      .subscribe(
        (data) => {
          this.contests = data;
          this.contestIds = data.map((contest) => contest._id);
          this.selectedContestId = this.contestIds.length > 0 ? this.contestIds[0] : null;
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Error fetching past contests';
          this.isLoading = false;
        }
      );
  }

  getActiveContests(): void {
    this.http
      .post<Contest[]>(
        `${this.apiUrl}/getActiveContests`,
        { ACCESS_TOKEN: this.cookieService.get('ACCESS_TOKEN') },
        { headers: this.headers }
      )
      .subscribe(
        (data) => {
          this.contests = data;
          this.contestIds = data.map((contest) => contest._id);
          this.selectedContestId = this.contestIds.length > 0 ? this.contestIds[0] : null;
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Error fetching active contests';
          this.isLoading = false;
        }
      );
  }

  getUpcomingContests(): void {
    const accessToken = this.cookieService.get('ACCESS_TOKEN');
    this.http
      .post<Contest[]>(
        `${this.apiUrl}/getUpcomingContests`,
        { ACCESS_TOKEN: accessToken },
        { headers: this.headers }
      )
      .subscribe(
        (data) => {
          this.contests = data;
          this.contestIds = data.map((contest) => contest._id);
          this.selectedContestId = this.contestIds.length > 0 ? this.contestIds[0] : null;
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Error fetching upcoming contests';
          this.isLoading = false;
        }
      );
  }
}
