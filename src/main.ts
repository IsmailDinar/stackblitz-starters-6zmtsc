import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { switchMap, delay, firstValueFrom } from 'rxjs';
import 'zone.js';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
  `,
  imports: [HttpClientModule],
})
export class App implements OnInit {
  name = 'Angular';
  private http = inject(HttpClient);
  private apiKey = 'RGAPI-b495b9c3-e195-4637-9af3-30b48602ca90';
  private baseUrl = 'https://euw1.api.riotgames.com/';
  public res = new Map();
  private dobleTroblePUUId =
    'tSxK8RD6d9Be23ezQ3533piH0f_Eqr-zINQNySB5gkoTHbLaSei88hAU4p2Gdpf-c5cl-QOTe6qDHQ';
  private dolipraanesPUUId =
    'HP37_ZltfqfPBDeW86O49TXpLlBK9ZLoFBeJ-HJ2owjmMfdXrB5YOv_kkhytCGdQBHRrQvQZqvmyNQ';
  private moncefbaePUUId =
    'hwnoBsFfTckaH2bOs3NWMjoXnCFbWzD_GknrmbuA9wkX_7xiT7d1s4uSSQbCRhsY94dI2xsOOAGrGQ';
  private bagriPUUId =
    'dbehg7PrLYcwEc2PhBdHqowcglV_sRvUEBHiiyrlTd3NYcOAJbQARhMMZezeSOrRFRi0cKRxXLrXkg';
  private neroxinPUUId =
    'd8dsbSTV8Eu_UW_PuO-wS4eZAcu4rnR3oEO7ofy-szkgBBFowFF68kIBuS65JPMUQwe023p7f0yN-g';

  private puuids = [
    {
      name: 'dolipraane',
      puuid: this.dolipraanesPUUId,
    },
    {
      name: 'dobletroble',
      puuid: this.dobleTroblePUUId,
    },
    {
      name: 'crentistdentist',
      puuid: this.moncefbaePUUId,
    },
    {
      name: 'bagri',
      puuid: this.bagriPUUId,
    },
    {
      name: 'pepe silvia',
      puuid: this.neroxinPUUId,
    },
  ];

  public count = 0;
  public matchIds: string[] = [];

  public async ngOnInit() {
    const summoner: any = await this.http
      .get(
        this.baseUrl +
          'lol/summoner/v4/summoners/by-name/DobleTroble' +
          '?api_key=' +
          this.apiKey
      )
      .toPromise();

    console.log(summoner);

    for (let i = 0; i < 7; i++) {
      const matchIds: string[] = (await firstValueFrom(
        this.http.get(
          'https://europe.api.riotgames.com/' +
            'lol/match/v5/matches/by-puuid/' +
            summoner['puuid'] +
            '/ids' +
            '?api_key=' +
            this.apiKey +
            '&queue=450&count=100&start=' +
            (i * 100 + 1)
        )
      )) as any;
      console.log(matchIds);
      this.matchIds = this.matchIds.concat(matchIds);

      await sleep(500);
    }
    console.log(this.matchIds);

    for (const matchId of this.matchIds) {
      const match: any = await firstValueFrom(
        this.http.get(
          'https://europe.api.riotgames.com/' +
            'lol/match/v5/matches/' +
            matchId +
            '/timeline?api_key=' +
            this.apiKey
        )
      );
      await sleep(1000);
      if (!match.metadata.participants.includes(this.dolipraanesPUUId)) {
        continue;
      }
      this.count++;
      const frame = match.info.frames[1];
      const event = frame.events.find(
        (event: any) => event.type === 'CHAMPION_KILL'
      );
      if (event) {
        const victimId = event.victimId;
        const victimPUUID = match.info.participants.find(
          (participant: any) => participant.participantId === victimId
        ).puuid;
        const victim = this.puuids.find((p) => p.puuid === victimPUUID);
        if (!victim) {
          continue;
        }

        if (this.res.has(victim.name)) {
          this.res.set(victim.name, this.res.get(victim.name) + 1);
        } else {
          this.res.set(victim.name, 1);
        }
        console.log(this.res);
        console.log(this.count);
      }
    }
  }
}

bootstrapApplication(App);
