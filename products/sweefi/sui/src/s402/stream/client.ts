/**
 * s402 Stream Scheme — Client
 *
 * Two-phase streaming protocol:
 *   Phase 1 (402 exchange): Client builds stream creation PTB → submits
 *   Phase 2 (ongoing): Client includes X-STREAM-ID header on subsequent requests
 */

import type {
  s402ClientScheme,
  s402PaymentPayload,
  s402PaymentRequirements,
  s402SettlementVerification,
  s402SettleResponse,
  s402StreamPayload,
} from 's402';
import type { SweefiConfig } from '../../ptb/types.js';
import type { ClientSuiSigner } from '../../signer.js';
import { Transaction } from '@mysten/sui/transactions';
import { S402_VERSION } from 's402';
import { bpsToMicroPercent } from '../../ptb/assert.js';
import { StreamContract } from '../../transactions/stream.js';
import { createBuilderConfig } from '../../utils/config.js';
import { verifySuiSettlement } from '../verify.js';

export class StreamSuiClientScheme implements s402ClientScheme {
  readonly scheme = 'stream' as const;
  readonly #contract: StreamContract;

  constructor(
    private readonly signer: ClientSuiSigner,
    config: SweefiConfig,
  ) {
    this.#contract = new StreamContract(
      createBuilderConfig({
        packageId: config.packageId,
        protocolState: config.protocolStateId,
      }),
    );
  }

  async createPayment(requirements: s402PaymentRequirements): Promise<s402StreamPayload> {
    const stream = requirements.stream;
    if (!stream) {
      throw new Error('Stream requirements missing from s402PaymentRequirements');
    }

    const tx = new Transaction();
    tx.setSender(this.signer.address);

    this.#contract.create({
      coinType: requirements.asset,
      sender: this.signer.address,
      recipient: requirements.payTo,
      depositAmount: BigInt(stream.minDeposit),
      ratePerSecond: BigInt(stream.ratePerSecond),
      budgetCap: BigInt(stream.budgetCap),
      feeMicroPercent: bpsToMicroPercent(requirements.protocolFeeBps ?? 0),
      feeRecipient: requirements.protocolFeeAddress ?? requirements.payTo,
    })(tx);

    const { signature, bytes } = await this.signer.signTransaction(tx);

    return {
      s402Version: S402_VERSION,
      scheme: 'stream',
      payload: {
        transaction: bytes,
        signature,
      },
    };
  }

  verifySettlement(
    payload: s402PaymentPayload,
    settleResponse: s402SettleResponse,
  ): s402SettlementVerification {
    return verifySuiSettlement('stream', payload, settleResponse);
  }
}
