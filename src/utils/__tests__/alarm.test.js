import { createAlarm } from "../alarm";

function fakeContext(initial = "running") {
  const made = { oscillators: [], closed: false };
  class FakeContext {
    constructor() { this.state = initial; this.destination = {}; made.ctx = this; }
    createOscillator() { const o = { type: "", frequency: { value: 0 }, connect() {}, disconnect() {}, start() { this.started = true; }, stop() { this.stopped = true; } }; made.oscillators.push(o); return o; }
    createGain() { return { gain: { value: 1 }, connect() {}, disconnect() {} }; }
    async resume() { if (initial !== "blocked") this.state = "running"; }
    async close() { made.closed = true; }
  }
  return { FakeContext, made };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("starts a siren that alternates two tones", async () => {
  const { FakeContext, made } = fakeContext();
  const alarm = createAlarm({ AudioContextClass: FakeContext });
  expect(await alarm.start()).toBe(true);
  const osc = made.oscillators[0];
  expect(osc.started).toBe(true);
  const first = osc.frequency.value;
  jest.advanceTimersByTime(460);
  expect(osc.frequency.value).not.toBe(first);
  jest.advanceTimersByTime(460);
  expect(osc.frequency.value).toBe(first);
  alarm.stop();
});

test("stop silences it and closes the audio", async () => {
  const { FakeContext, made } = fakeContext();
  const alarm = createAlarm({ AudioContextClass: FakeContext });
  await alarm.start();
  alarm.stop();
  expect(made.oscillators[0].stopped).toBe(true);
  expect(made.closed).toBe(true);
});

test("a siren never runs for more than a minute", async () => {
  const { FakeContext, made } = fakeContext();
  const alarm = createAlarm({ AudioContextClass: FakeContext });
  await alarm.start();
  jest.advanceTimersByTime(60001);
  expect(made.oscillators[0].stopped).toBe(true);
});

test("when the browser blocks sound, start says so, and nothing throws", async () => {
  const { FakeContext } = fakeContext("blocked");
  const alarm = createAlarm({ AudioContextClass: FakeContext });
  expect(await alarm.start()).toBe(false);
  alarm.stop();
});

test("a browser with no audio support is reported as such and stays quiet", async () => {
  const alarm = createAlarm({ AudioContextClass: null });
  expect(alarm.isSupported).toBe(false);
  expect(await alarm.start()).toBe(false);
  expect(() => alarm.stop()).not.toThrow();
});

test("resume after stop does nothing", async () => {
  const { FakeContext } = fakeContext();
  const alarm = createAlarm({ AudioContextClass: FakeContext });
  await alarm.start();
  alarm.stop();
  expect(await alarm.resume()).toBe(false);
});
